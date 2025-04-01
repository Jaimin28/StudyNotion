const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});

// a function which is use for send mail

async function sendVerificationEmail(email,otp) {
    try {
        const mailResponse = await mailSender(email,"Verification Email from studynotion",otp);
        console.log("email send successfully",mailResponse);
        
    } catch (error) {
        console.log("error occured while sending mails: ",error);
        throw error;
    }
    
}
// using pre middleware we send otp mail to user before saving into db
otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})



module.exports = mongoose.model("OTP",otpSchema); 