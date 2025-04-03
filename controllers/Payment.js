const {instace} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");


// capture the payment and intiate the razorpay order

exports.capturePayment = async (req,res) =>{
    // get courseId and Userid
    const {courseId} = req.body;
    const userId = req.user.id;
    // validation
    // valid CourseId
    if(!courseId){
        return res.status(403).json({
            success:false,
            message:"Please Provide valid Course ID"
        })
    }
    let course;
    try {
        course = await Course.findById(courseId);
        if(!course){
            return res.status(401).json({
                success:false,
                message:"Could not find the course"
            })
        }
         // check for user already pay for same course
         const uid = new mongoose.Types.ObjectId(userId);
         if(course.StudentsEnrolled.includes(uid)){
            return res.status(403).json({
                success:false,
                message:"User is already Enrolled"
            })
         }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
    // valid courseDetails
    
    // create order
    const amount = course.price;
    const currency = "INR";
    const option = {
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId
        }

    };
    try {
        // initiate the payment using razorepay
        const paymentResponse =  await  instace.orders.create(option);
        console.log(paymentResponse);
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency : paymentResponse.currency,
            amount : paymentResponse.amount
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Could not intiate order"
        })
        
    }


    // return response

};


// verify signature

exports.verifySignature = async (req,res) =>{
    const webhookSecret = "12345678";
    // take signnature from razorpay
    const signature = req.headers("x-razorpay-signature");


    // convert webhooksecret to signture

    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
}