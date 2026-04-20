const Razorpay = require("razorpay");

// config/env.js
require("dotenv").config({ path: "./server/.env" });

exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});