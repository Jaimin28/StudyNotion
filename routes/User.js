const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions

const {
    Login,
    signUp,
    SendOtp,
    changePassword,
  } = require("../controllers/Auth");

const {
    resetPasswordtoken,
    resetPassword,
} = require("../controllers/Resetpassword");


const { auth } = require("../middlewares/auth");

// Route for user login
router.post("/login", Login);

// Route for user signup
router.post("/signup", signUp);

// Route for sending OTP to the user's email
router.post("/sendotp", SendOtp);

// Route for Changing the password
router.post("/changepassword", auth, changePassword);

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordtoken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router
