const mongoose = require("mongoose");

const ratingandreviewsSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("RatingAndReviews",ratingandreviewsSchema);