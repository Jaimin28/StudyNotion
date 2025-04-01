const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    Instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    WhatYouWillLearn:{
        type:String,
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Section'
        }
    ],
    RatingandReviews : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'RatingAndReviews'
        }
    ],
    price:{
        type:String,
    },
    thumbnail:{
        type:String,
    },
    tag:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Tag'
        }
    ],
    StudentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        }
    ]
})

module.exports = mongoose.model("Course",courseSchema);