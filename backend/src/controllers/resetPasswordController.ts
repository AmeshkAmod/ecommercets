import { Request, Response } from "express";
import { resetUserPassword } from "../services/resetPasswordService.js";

interface ResetParms {
    token: string;
}

export const resetPassword = async (req: Request<ResetParms>, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
    
        await resetUserPassword(token, password);

        res.status(200).json({
            message: "Password updated successfully",
        });

        res.json({ message: "Password updated" });
    } catch (error: any) {
        res.status(400).json({
            message: error.message,
        });
    }
};