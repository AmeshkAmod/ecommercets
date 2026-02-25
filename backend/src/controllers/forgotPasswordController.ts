import { Request, Response } from "express";
import { generateResetToken } from "../services/forgetPasswordService.js";

export const forgotPassword = async (req: Request, res: Response) => {

    try{
        const { email } = req.body;

        const { resetToken } = await generateResetToken(email);

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // send email here

        res.status(200).json({
            message: "Reser link sent",
            resetUrl // for dev testing heve to deleter later
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};