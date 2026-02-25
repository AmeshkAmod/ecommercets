import crypto from "crypto";
import UserModel, { type UserDocument} from "../models/User.js";

export async function resetUserPassword(token: string, newPassword: string) {
    
    // hash incoming token
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    
    //find valid user
    const user = await UserModel.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    }) as UserDocument | null;

    if (!user) {
        throw new Error(" Invalid or expired reset token ");
    }

    //update pass
    user.password = newPassword;

    //clear reset fields
    user.set({
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
    });

    await user.save();

    return true;
}