const express = require("express");
const router = express.Router();
const Featured_Product = require("../models/featuredProduct");
const Deals = require("../models/deals");

router.get("/api/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    let product = await Featured_Product.findById(productId);
    if (!product) {
      product = await Deals.findById(productId);
    }
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Server error." });
  }
});
router.post("/api/products", async (req, res) => {
  try {
    const newProduct = new Featured_Product(req.body);  
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error saving product", error: err.message });
  }
});
module.exports = router;
