import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/authTypes.js";

export const protect = async (req:Request, res:Response, next:NextFunction) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }
  
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    //making sure decoded is an object
    if (typeof decoded !=="object" || decoded === null) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    // cast safety
    req.user = decoded as JwtPayload;

    next();
  } catch {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

// export const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user || !allowedRoles.some(role => req.user.roles.includes(role))) {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     next();
//   };
// };
