const mongoose = require("mongoose");
const category = require("./category");

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
    tag:{
        type:[String],
        required:true
    },
    category:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category'
        },
    
    StudentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        }
    ],
    instruction :{
        type:[String]
    },
    status:{
        type:String,
        enum:["Draft","Published"],
    }
})

module.exports = mongoose.model("Course",courseSchema);