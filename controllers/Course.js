const Tag = require("../models/tags");
const Course = require("../models/Course");
const User = require("../models/User");
const {imageUploadToCloudinary} = require("../utils/imageUploader");

exports.createCourse = async (req,res) =>{
    try {
        // fetch the data from req body
        const {courseName, courseDescription, WhatYouWillLearn,price,tag} = req.body;

        // validation
        if(!courseName || !courseDescription || !WhatYouWillLearn || !price || !tag){
            return res.status(401).json({
                success:false,
                message:"All feilds are Required"
            })
        }
        // get file from rew
        const thumbnail = req.files.thumbnailImage;

        // check for instructor
        const userId=req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log(instructorDetails);
        // validate that instructor is present or not
        if(!instructorDetails){
            return res.status(403).json({
                success:false,
                message:"Instruction details not found"
            })
        }
        // fetch tag details from db on the basis of tag id
        const tagDetails = await Tag.findById(tag);
        // validate tag
        if(!tag){
            return res.status(403).json({
                success:false,
                message:"tag details not found"
            })
        }
        // store thumbnail to cloudinary in particular folder
        const thumbnailImage = await imageUploadToCloudinary(thumbnail,process.env.FOLDDER_NAME);
        //  create a entry in db
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            Instructor:instructorDetails._id,
            WhatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url
        })
        
        // add the new course to the user schema of instructor

        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {
                new:true,
            }
        );

        // update the tag schema HW
        return res.status(200).json({
            success:true,
            message:"new course create succesfully",
            data:newCourse
        })



    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:error.message
        })
        
    }
}


// getallcourses handler

exports.showAllCourses = async (req,res) =>{
    try {
        const allCourses = await Course.find({},{courseName:true,courseDescription:true,price:true,thumbnail:true,tag:true,RatingandReviews:true,StudentsEnrolled:true,Instructor:true}).populate("Instructor").exec();
        return res.status(200).json({
            success:true,
            message:"All courses data fetch succesfully",
            data:allCourses
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}