import uploadImageToCloudinary from "../utils/Cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, footType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadImageToCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }
    const item = await Item.create({
      name,
      category,
      footType,
      price,
      image,
      shop: shop._id,
    });
    return res.status(201).json(item);
  } catch (err) {
    return res.status(500).json({ message: `add item error: ${err}` });
  }
};

export const editItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { name, category, footType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadImageToCloudinary(req.file.path);
    }
    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        footType,
        price,
        image,
      },
      { new: true },
    );

    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: `edit item error: ${error}` });
  }
};
