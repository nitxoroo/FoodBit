import uploadImageToCloudinary from "../utils/Cloudinary.js";
import Shop from "../models/shop.model.js";

export const createAndEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    let image;
    if (req.file) {
      image = await uploadImageToCloudinary(req.file.path);
    }

    let shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      const shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      const shop = await Shop.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          address,
          image,
          owner: req.userId,
        },
        { new: true },
      );
    }

    await shop.populate("owner");
    return res.status(201).json(shop);
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
      return null;
    }
    return res.status(200).json(shop);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Failed to get shop error : ${error}` });
  }
};
