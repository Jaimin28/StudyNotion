const Razorpay = require("razorpay");
require("dotenv").config();
exports.instace = new Razorpay({
    key_id:process.env.Razorpay_KEY,
    key_secret:process.env.Razorpay_SECRET
})
