const express = require('express');
const router = express.Router();
const Featured_Product = require("../models/featuredProduct");


router.get('/', async (req, res) => {
  try{
    const featuredproduct = await Featured_Product.find();
    res.json(featuredproduct);
  }catch(error){ 
    res.status(500).json({ message: "Error fetching deals", error }) 
  };

});
module.exports = router;
