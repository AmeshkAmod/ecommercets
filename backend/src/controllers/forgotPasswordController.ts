import { Request, Response } from "express";
import { sendResetEmail } from "../services/emailService.js";
import { generateResetToken } from "../services/forgetPasswordService.js";

export const forgotPassword = async (req: Request, res: Response) => {

    try{
        const { email } = req.body;

        const { resetToken } = await generateResetToken(email);

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // send email here
        await sendResetEmail(email, resetUrl);

        res.status(200).json({
            message: "Reser link sent", // for dev testing heve to deleter later
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};