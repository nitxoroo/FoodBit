import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create reusable transporter using SMTP config from environment
const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

});

export const sendOtpEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: `"FoodBit" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Password Reset OTP — FoodBit",
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff9f6; border-radius: 12px; border: 1px solid #ffe0d6;">
                <h1 style="color: #ff4d2d; margin: 0 0 8px 0; font-size: 28px;">FoodBit</h1>
                <p style="color: #666; font-size: 14px; margin: 0 0 24px 0;">Password Reset Request</p>
                
                <p style="color: #333; font-size: 15px; line-height: 1.6;">
                    We received a request to reset your password. Use the OTP below to verify your identity:
                </p>
                
                <div style="text-align: center; margin: 24px 0;">
                    <span style="display: inline-block; background: #ff4d2d; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 32px; border-radius: 8px;">
                        ${otp}
                    </span>
                </div>
                
                <p style="color: #666; font-size: 13px; line-height: 1.5;">
                    This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
                </p>
                
                <hr style="border: none; border-top: 1px solid #ffe0d6; margin: 24px 0;" />
                
                <p style="color: #999; font-size: 12px; margin: 0;">
                    If you did not request this, please ignore this email. Your password will remain unchanged.
                </p>
            </div>
        `,
    };

    return await transporter.sendMail(mailOptions);
};

export default transporter;
