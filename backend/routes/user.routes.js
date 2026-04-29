import express from "express";
import { GetCurrUser } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

userRouter.get("/current",isAuth,GetCurrUser);


export default userRouter;