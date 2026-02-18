import type { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService.js";
import type { RegisterDTO, LoginDTO } from "../types/authTypes.js";

export const register = async (req:Request, res:Response) => {
  try {
    const data = req.body as RegisterDTO;

    const user = await registerUser(data);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req:Request, res:Response) => {
  try {
    const data = req.body as LoginDTO;

    const { user, token } = await loginUser(data);
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
