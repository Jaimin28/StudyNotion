const mongoose = require("mongoose");
const { type } = require("os");

const courseProgress = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course'
    },
    completedVideos : [
        {
            type:mongoose.Schema.types.ObjectId,
            ref:'SubSection'
        }
    ]
});

module.exports = mongoose.model("CourseProgress",courseProgress);