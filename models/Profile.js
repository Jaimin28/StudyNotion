const mongoose = require("mongoose");
const { type } = require("os");

const Profileschema = new mongoose.Schema({
    gender:{
        type:String,
    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    contactNumber:{
        type:Number,
        trim:true
    }
});

module.exports = mongoose.model("Profile",Profileschema);