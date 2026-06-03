import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (toEmail, otp) => {
  return await resend.emails.send({
    from: "FoodBit <onboarding@resend.dev>",
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
  });

  //   try {
  //     const result = await resend.emails.send({
  //       from: "FoodBit <onboarding@resend.dev>",
  //       to: toEmail,
  //       subject: "Password Reset OTP — FoodBit",
  //       html: "<h1>Test Email</h1>",
  //     });

  //     console.log("Resend Response:", result);
  //   } catch (error) {
  //     console.error("Resend Error:", error);
  //   }
};

export default resend;
