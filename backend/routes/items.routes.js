import express from "express";
import { GetCurrUser } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import { createAndEditShop } from "../controllers/shop.controller.js";
import { addItem, editItem } from "../controllers/item.controller.js";
import { upload } from "../middlewares/multer.js";

const itemRouter = express.Router();

itemRouter.post("/Add-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/Edit-item/:id", isAuth, upload.single("image"), editItem);

export default itemRouter;
0;
