import Product from "../models/product.js";

export const listProducts = async (req, res) => {
  const q = req.query.q || "";
  const products = await Product.find({
    title: { $regex: q, $options: "i" },
  }).limit(50);
  res.json(products);
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

export const createProduct = async (req, res) => {
  const p = await Product.create(req.body);
  res.json(p);
};

export const updateProduct = async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(p);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

export const addProductReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // prevent multiple reviews from same user
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name || req.user.email,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.numReviews;

    await product.save();

    res.status(201).json({
      message: "Review added",
      product,
    });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({ message: "Failed to add review" });
  }
};
