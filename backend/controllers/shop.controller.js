import uploadImageToCloudinary from "../utils/Cloudinary.js";
import Shop from "../models/shop.model.js";

export const createAndEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    const existingShop = await Shop.findOne({ owner: req.userId });
    const image = req.file
      ? await uploadImageToCloudinary(req.file.path)
      : existingShop?.image;

    if (!existingShop && !image) {
      return res.status(400).json({ message: "Shop image is required" });
    }

    const payload = {
      name,
      city,
      state,
      address,
      image,
      owner: req.userId,
    };

    let shop;
    if (!existingShop) {
      shop = await Shop.create(payload);
    } else {
      shop = await Shop.findByIdAndUpdate(existingShop._id, payload, {
        new: true,
      });
    }

    await shop.populate("owner");
    return res.status(existingShop ? 200 : 201).json(shop);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Create shop Failed error : ${error}` });
  }
};

export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId }).populate("owner");
    if (!shop) {
      return res.status(200).json(null);
    }
    return res.status(200).json(shop);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Failed to get shop error : ${error}` });
  }
};
