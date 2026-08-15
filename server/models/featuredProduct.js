const mongoose = require('mongoose')

const featuredProduct = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    image:String,
    details:Array,
    dimensions:String,
    seller:Object

});

module.exports = mongoose.model("FeaturedProduct",featuredProduct);