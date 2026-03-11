import express from "express";
import UserModel from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */


/* GET current user */
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     description: Retrieve the currently logged-in user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/me", protect, async (req: any, res) => {
  const user = await UserModel.findById(req.user._id)
    .select("-password")
    .populate("roles");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);});

/* UPDATE current user */

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user
 *     tags: [Users]
 *     description: Update profile information of the logged-in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
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