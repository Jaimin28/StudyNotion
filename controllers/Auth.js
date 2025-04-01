const User = require("../models/User");
const OTP = require("../models/OTP");
const OtpGenerator = require("otp-generator");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
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

    res.status(200).json({
      success: true,
      message: "Otp Sent Sucessfully",
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
    if (recentOtp.length() == 0) {
      return res.status(400).json({
        success: false,
        message: "Otp does not found",
      });
    }
    // validate otp
    else if (otp !== recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP Does not match",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

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
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`,
    });
    // return res
    return res.status(200).json({
      success: true,
      message: "User succesfully registered",
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

exports.changePassword = async (req,res)=>{
    // get the data from req body
    const {newPasswor,email} = req.body;

    // get old password,new password,confirmnewpassword
    const user = await User.findOne({email});
     
    // validation
    if(!user){
      return res.status(401).json({
        success:false,
        message:"User with this email is not found"
      })
    }
    // update and pwd in db
    // send mail -password update
    // return response
}
