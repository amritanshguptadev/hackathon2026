// const express = require('express');
// const router = express.Router();
// const categoryData = require('../data/categoryData');

// router.get('/', (req, res) => {
//   res.json(categoryData);
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Category = require("../models/category");

router.get("/", async(req,res)=>{
  try{
    const category = await Category.find();
    res.status(200).json(category);
  }
  catch(error){
    console.log(error.message);
    res.status(500).json({ message: "Error fetching category", error });
  }
})

module.exports = router;