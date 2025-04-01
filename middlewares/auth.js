const jwt = require("jsonwebtoken")
require("dotenv").config();
const User=require("../models/User");
const { decrypt } = require("dotenv");
// auth
exports.auth=async (req,res,next) =>{
    try {
        // extract the token
        const token = req.cookie.token || req.body.token || req.header("Authorisation").replace("Bearer ","");
        // token missing
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing"
            })
        };
        // verify the token
        try {
            const decode =  jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
            
        } catch (error) {
            // verification issue
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(400),json({
            success:false,
            message:"something went wrong while validating the token"
            
        })
        
    }
}
// isstudent

exports.isStudent = async (req,res,next) => {
    try {
        if(req.user.accountType != "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected routes for student only"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role can not be verified"
        })
    }

}

// inInstructor
exports.isInstructor = async (req,res,next) => {
    try {
        if(req.user.accountType != "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected routes for Instructor only"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role can not be verified"
        })
    }

}

// isadmin

exports.isAdmin = async (req,res,next) => {
    try {
        if(req.user.accountType != "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected routes for Admin only"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role can not be verified"
        })
    }

} 
