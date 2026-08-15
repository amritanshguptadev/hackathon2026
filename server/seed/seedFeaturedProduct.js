require("dotenv").config();

const mongoose = require("mongoose");
const featured_Product = require("../models/featuredProduct");
const featured_product = require("../data/FeaturedProduct");

mongoose
    .connect(process.env.MONGO_CONN, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async ()=> {
        await featured_Product.deleteMany();
        await featured_Product.insertMany(featured_product);
        console.log("** Featured Data is Inserted successfully! **");
        mongoose.connection.close();
    })
    .catch((err)=>{
        console.log("😞 Seeding failed:", err)
    })  