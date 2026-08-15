const route = require('express').Router();
const User = require("../middleware/userProfile")
const userValidator = require('../controller/profileValidator')
route.get("/profile",User,userValidator);

module.exports = route;