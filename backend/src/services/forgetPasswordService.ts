import crypto from "crypto";
import userModel from "../models/User.js";

export async function generateResetToken(email: string) {
    const user = await userModel.findOne({ email });
    
    if (!user) {
        throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() +10 * 60 * 1000);

    await user.save();

    return { resetToken, userModel};
}