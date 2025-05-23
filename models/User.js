const mongoose = require("mongoose");
const { type } = require("os");

const Userschema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
       
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin","Student","Instructor"],
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress"
        }
    ],
    image:{
        type:String,
        requires:true
    },
    token:{
        type:String
    },
    resetPasswordExpire:{
        type:Date
    }
});

module.exports = mongoose.model("User",Userschema);