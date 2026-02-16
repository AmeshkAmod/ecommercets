import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  roles?: string[];
}

interface LoginBody {
  email: string;
  password: string;
}

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : "Internal server error";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

export const register = async (
  req: Request<Record<string, never>, unknown, RegisterBody>,
  res: Response,
) => {
  const { name, email, password, roles } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      roles: Array.isArray(roles) && roles.length > 0 ? roles : ["user"],
    });

    const userRoles = Array.isArray(user.roles)
      ? user.roles.map((role: unknown) => String(role))
      : [];
    const isAdmin = userRoles.includes("admin");

    const token = jwt.sign(
      {
        id: String(user._id),
        roles: userRoles,
        isAdmin,
      },
      getJwtSecret(),
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: userRoles,
        isAdmin,
      },
    });
  } catch (err: unknown) {
    return res.status(500).json({ message: getErrorMessage(err) });
  }
};

export const login = async (
  req: Request<Record<string, never>, unknown, LoginBody>,
  res: Response,
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, String(user.password));
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userRoles = Array.isArray(user.roles)
      ? user.roles.map((role: unknown) => String(role))
      : [];
    const isAdmin = userRoles.includes("admin");

    const token = jwt.sign(
      {
        id: String(user._id),
        roles: userRoles,
        isAdmin,
      },
      getJwtSecret(),
      { expiresIn: "7d" },
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: userRoles,
        isAdmin,
      },
    });
  } catch (err: unknown) {
    return res.status(500).json({ message: getErrorMessage(err) });
  }
};
