import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

function createTransport() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
    },
    });
}

export async function sendResetEmail(
    to: string,
    resetUrl: string
) {
    const transporter = createTransport();

    await transporter.sendMail({
        from: `"DarkCart Support" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Password Reset Request",
        html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" target="_blank">${resetUrl}</a>
            <p>This link expires in 10 minutes.</p>
        `,
    });
}