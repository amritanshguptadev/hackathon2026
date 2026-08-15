
// Getting data fropm data folder!1
// const express = require('express');
// const router = express.Router();
// const deals = require('../data/deals');

// router.get('/', (req, res) => {
//   res.json(deals);
// });

// module.exports = router;









// Getting data through mongodb!!
const express = require("express");
const router = express.Router();
const Deal = require("../models/deals");

router.get("/", async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deals", error });
  }
});

module.exports = router;
