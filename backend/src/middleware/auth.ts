import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { Types } from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

interface JwtPayloadClaims extends JwtPayload {
  id: string;
  roles?: string[];
  isAdmin?: boolean;
}

const hasUserId = (payload: string | JwtPayload): payload is JwtPayloadClaims => {
  return typeof payload !== "string" && typeof payload.id === "string";
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT_SECRET is not configured" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (!hasUserId(decoded)) {
      return res.status(401).json({ message: "Token invalid" });
    }

    const user = await User.findById(decoded.id).select(
      "_id name email roles overrides",
    );
    if (!user) {
      return res.status(401).json({ message: "Not authorised, user not found" });
    }

    req.user = {
      _id: user._id as Types.ObjectId,
      name: String(user.name),
      email: String(user.email),
      roles: Array.isArray(user.roles)
        ? user.roles.map((role: unknown) => String(role))
        : [],
      overrides: Array.isArray(user.overrides)
        ? user.overrides.map((override: unknown) => String(override))
        : [],
      isAdmin:
        decoded.isAdmin ??
        (Array.isArray(user.roles) &&
          user.roles.some((role: unknown) => String(role) === "admin")),
    };

    next();
  } catch (_err: unknown) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
