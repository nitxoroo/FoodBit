import express from "express";
import { GetCurrUser } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import {
  createAndEditShop,
  getMyShop,
} from "../controllers/shop.controller.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router();

shopRouter
  .post("/create-edit", isAuth, upload.single("image"), createAndEditShop)
  .get("/my-shop", isAuth, getMyShop);

export default shopRouter;
