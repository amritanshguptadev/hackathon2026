// models/Deal.js
const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    image:String,
    details:Array,
    dimensions:String,
    seller:Object
});

module.exports = mongoose.model("Deal", dealSchema);
