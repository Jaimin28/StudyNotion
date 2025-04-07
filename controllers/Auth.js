const User = require("../models/User");
const OTP = require("../models/OTP");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { passwordUpdate } = require("../mail/templates/passwordUpdate");
const mailSender = require("../utils/mailSender");
const {otpTemplate} = require("../mail/templates/emailVerificationTemplet");
const Profile = require("../models/Profile");
// send otp controller

exports.SendOtp = async (req, res) => {
  try {
    // first fetch the email from req body
    const { email } = req.body;

    // check user is already present or not
    const checkUserPresent = await User.findOne({ email });

    // if user present then throw error that user already register

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already Registered",
      });
    }
    var otp = OtpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("otp generated: ", otp);

    // check in db if this generated otp is present or not in db

    const result = await User.findOne({ otp: otp });
    // if otp is present in db then generate new otp untill uniq otp generate

    while (result) {
      var otp = OtpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      console.log("otp generated: ", otp);
    }

    // create a payload which is store in db

    const Otppayload = { email, otp };
    // create a otp entry

    const otpBody = await OTP.create(Otppayload);
    console.log(otpBody);
    // await mailSender(email, "OTP Verification", otpTemplate(otp));
    
    res.status(200).json({
      success: true,
      message: "Otp Sent Sucessfully",
      otp
    });
  } catch (error) {
    console.log(error);
    return res.json(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    // fetch data from req body
    const {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    // validate the data
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Enter all the Field",
      });
    }
    // 2 password matching password&confirmpassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password And ConfirmPassword value does not match",
      });
    }
    // check user already exits or not
    const exitingUser = await User.findOne({ email });
    if (exitingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Registered",
      });
    }
    // find most recent one otp
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Otp does not found",
      });
    }
    // validate otp
    // else if(otp! == response[0].otp)
    else if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "OTP Does not match",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    // create a profile entry for user

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    // create entry in db

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      approved: approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`,
    });
    // return res
    return res.status(200).json({
      success: true,
      message: "User succesfully registered",
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "User not register",
    });
  }
};

// login

exports.Login = async (req, res) => {
  try {
    // fetch the data from req body
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All field are required",
      });
    }
    // check user
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user is not registered signup first",
      });
    }
    // password match

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Loged in succesfully",
      });
    }
    // token generate JWT
    // create a cookie
    else {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }

    // send res
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Failed to Login",
    });
  }
};

// change password

exports.changePassword = async (req, res) => {
  try {
    // get user details
    const userDetails = await User.findById(req.user.id);

    // get old and new password and confirm password from req body
    const { oldPassword, newPassword } = req.body;

    // validate old password
    const validatePassword = await brcypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!validatePassword) {
      return res.status(400).json({
        success: false,
        message: "Old password does not match",
      });
    }

    // update password
    const encryptPassword = await brcypt.hash(newPassword, 10);
    const userUpdateDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptPassword },
      { new: true }
    );

    // send mail notification
    try {
      const emailResponse = await passwordUpdate(
        userDetails.email,
        userDetails.name
      );
      console.log("Email sent Successfull", emailResponse);
    } catch (error) {
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
