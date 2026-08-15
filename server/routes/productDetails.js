const express = require("express");
const router = express.Router();
const Featured_Product = require("../models/featuredProduct");
const Deals = require("../models/deals");
const uploadProductImage = require("../middleware/uploadProductImage");

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
router.post("/api/products", uploadProductImage, async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Parse seller if it's a string
    if (typeof productData.seller === 'string') {
      try {
        productData.seller = JSON.parse(productData.seller);
      } catch (e) {
        console.error("Error parsing seller:", e);
      }
    }
    
    // Parse details if it's a string
    if (typeof productData.details === 'string') {
      productData.details = productData.details.split(',').map(d => d.trim()).filter(d => d);
    }
    
    // Parse price
    if (productData.price) {
      productData.price = Number(productData.price);
    }

    // Set image URL
    if (req.file) {
      productData.image = `http://localhost:3000/uploads/products/${req.file.filename}`;
    }

    const newProduct = new Featured_Product(productData);  
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error saving product", error: err.message });
  }
});
module.exports = router;
