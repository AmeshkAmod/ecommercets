import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import RoleModel from "../models/role.js";
import type { RegisterDTO, LoginDTO, JwtPayload } from "../types/authTypes.js";

const SALT_ROUNDS = 10;

export const registerUser = async (data: RegisterDTO) => {
  const { name, email, password } = data;

  const exists = await UserModel.findOne({ email });
  if (exists) {
    throw new Error("User already exists");
  }

  //get default as User role
  const userRole = await RoleModel.findOne({ name: "USER" });
  if (!userRole) {
    throw new Error("Default role not configured");
  }

  const user = await UserModel.create({
    name,
    email,
    password,
    roles: [userRole._id],
  });

  return user;
};

export const loginUser = async (data: LoginDTO) => {
  const { email, password } = data;

  const user = await UserModel.findOne({ email }).populate("roles");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new Error("Invalid credentials");
  }

  const roles = user.roles.map((role: any) => role.name);

  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    roles,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return { user, token };
};
