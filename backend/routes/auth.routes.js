import express from "express";
import {
    signUp,
    signIn,
    signUpPartner,
    signInPartner,
    signUpDeliveryBoy,
    signInDeliveryBoy,
    logOut,
    forgotPassword,
    verifyOtp,
    resetPassword,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signUp", signUp)
    .post("/signIn", signIn)
    .post("/partner/signUp", signUpPartner)
    .post("/partner/signIn", signInPartner)
    .post("/delivery/signUp", signUpDeliveryBoy)
    .post("/delivery/signIn", signInDeliveryBoy)
    .get("/logout", logOut)
    .post("/forgot-password", forgotPassword)
    .post("/verify-otp", verifyOtp)
    .post("/reset-password", resetPassword)

export default authRouter;
