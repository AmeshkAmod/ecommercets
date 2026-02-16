import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorised, user not found"})
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
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

