import express from "express";
import { signUp, signIn, logOut, forgotPassword, verifyOtp, resetPassword} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signUp", signUp)
    .post("/signIn", signIn)
    .get("/logout", logOut)
    .post("/forgot-password", forgotPassword)
    .post("/verify-otp", verifyOtp)
    .post("/reset-password", resetPassword)

export default authRouter;