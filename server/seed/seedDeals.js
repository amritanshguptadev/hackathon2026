// Seed/seedDeals.js
require("dotenv").config();
const mongoose = require("mongoose");
const mongo_Deal = require("../models/deals");
const stored_deals = require("../data/deals")

mongoose
  .connect(process.env.MONGO_CONN)
  .then(async () => {
    await mongo_Deal.deleteMany(); 
    await mongo_Deal.insertMany(stored_deals);
    console.log(" Deals added to MongoDB");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
  });
