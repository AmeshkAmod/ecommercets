import  type{Request,Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User"

interface RegisterBody{
  name :string;
  email: string;
  password : string;
  roles?: string[];
}

   const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

const token = jwt.sign(
  {
    id: User._id.toString(),
    roles: User.roles,
    isAdmin: User.roles.includes("admin"),
  },
  secret,
  { expiresIn: "7d" }
);

  {
    id: User._id.toString(),
    roles: User.roles,
    isAdmin: User.roles.includes("admin"),
  },
  process.env.JWT_SECRET as string,
  { expiresIn: "7d" }
);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isAdmin: user.roles.includes("admin"),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
        isAdmin: user.roles.includes("admin"),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isAdmin: user.roles.includes("admin"),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
