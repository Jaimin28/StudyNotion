const mongoose = require("mongoose");
const { type } = require("os");

const subSection = new mongoose.Schema({
    Title:{
        type:String,
    },
    timeDuration:{
        type:String,
    },
    description:{
        type:String,
    },
    videoUrl:{
        type:String,
    }
});

module.exports = mongoose.model("SubSection",subSection);