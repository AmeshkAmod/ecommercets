import express from "express";
import UserModel from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* GET current user */
router.get("/me", protect, async (req: any, res) => {
  const user = await UserModel.findById(req.user._id)
    .select("-password")
    .populate("roles");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);});

/* UPDATE current user */
router.put("/me", protect, async (req: any, res) => {
  const { name, email, phone, address } = req.body;

  const user = await UserModel.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  if (address) {
    user.address = address;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    roles: updatedUser.roles,
    address: updatedUser.address,
  });
});

export default router;