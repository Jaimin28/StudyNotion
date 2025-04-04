const RatingAndReviews = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");


// createrating

exports.createRating = async (req,res)=>{
    try {
        // fetch the data from req body
        const {rating,review,courseId} = req.body;
        const userId = req.user.id;
        // check if user is enrolled or not
        const courseDetails = await Course.findOne({_id:courseId , 
                                                    StudentsEnrolled : {$eleMatch: {$eq: userId}}
                                                });
        
        // validate it
        if(!courseDetails){
            return res.status(402).json({
                success:false,
                message:"Student is not Enrolled in the course",
            })
        }
        // check student already review or not
        const alreadyReviewed =await RatingAndReviews.findOne({
                                                                user:userId,
                                                                course:courseId,
                                                            });

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course is already reviewd by user"
            })
        }
        if(!rating || !review){
            return res.status(401).json({
                success:false,
                message:"All fields are require"
            })
        }
        // create a rating
        const newReview = await RatingAndReviews.create({rating,review,course:courseId,user:userId});
        // add in course 
        const updatedcourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                                                        {
                                                                            $push:{
                                                                                RatingandReviews:newReview._id,
                                                                            }
                                                                        },
                                                                        {new:true}
                                                                    );
    // return response
    console.log(updatedcourseDetails);
                                                                    
    return res.status(200),json({
        success:true,
        message:"Rating asn Review created successfully",
        newReview
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error while creating rating"
        })
        
    }
};


// getaveragerating
exports.getAverageRating = async (req,res)=>{
    try {
        // get course id
        const {courseId} = req.body;
        // calcculate avrage rating
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating : { $avg:"$rating"},
                }
            }
        ]);
        // return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }
        // if no rating exits
        return res.status(200).json({
            success:true,
            message:"Avg rating is 0,no rating given till now",
            averageRating:0,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error while generating average rating"
        })
    }
}






// getallrating



exports.getAllReview = async (req,res) =>{
    try {
        const allreviews = await RatingAndReviews.find({}).sort({rating:"desc"}).populate({path:"user",select:"firstName lastName email image "}).populate({path:"course",select:"courseName"}).exec();
        return res.status(200).json({
            success:true,
            message:"All Reviews fetch successfully",
            allreviews
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}