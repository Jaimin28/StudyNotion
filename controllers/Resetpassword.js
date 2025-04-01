const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
// resetpasswordToken

exports.resetPasswordtoken  = async (req,res) =>{
   try {
     // get mail from req body
     const {email} = req.body;
    
     // check user for this email,email validation
     const user = await User.findOne({email});
     if(!user){
         return res.status(402).json({
             success:false,
             message:"your email is not registerred with us"
         })
     }
     // generate token
    //  crypto.randomUUID() = generate a random byte wwwhich help us uniq token
     const token = crypto.randomUUID();
     // update user by adding token and expiration time
     const updatedDetails = await User.findOneAndUpdate({email:email},{
         token:token,
         resetPasswordExpire:Date.now()+5*60*1000
     },{new:true});
     // create url
     const url = `http://localhost:3000/update-password/${token}`;
      // send mail containing url
      await mailSender(email,`Password Reset Link","Password reset link : ${url}`)
      // return res
      return res.json({
          success:true,
          message:"Email sent Succefully,please Check Email and change password"
      })
 }
    
   catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"error accour while resetpassword"
        })
         
   }
}

// reset password 

exports.resetPassword = async (req,res) =>{
   try {
     // data fetch
     const {token,confirmPassword,Password} = req.body;
     if(!confirmPassword || !Password){
         return res.json({
             success:false,
             message:"all field are mandatory"
         })
     }
     if(Password != confirmPassword){
         return res.json({
             success:false,
             message:"password not matchinng"
         })
     }
     // validation
     // get user details by using tyoken
     const userDetails = await User.findOne({token:token});
     // invalid token or expirestime
     if(!userDetails){
         return res.json({
             success:false,
             message:'token is invalid'
         })
     }
     if(userDetails.resetPasswordExpire < Date.now()){
         return res.json({
             success:false,
             message:"Link is expired"
         })
     }
 
     // hash password
     const hashPassword = await bcrypt.hash(Password,10);
 
     // update password
    await User.findOneAndUpdate({token:token},{
         password:hashPassword
     },{new:true});
 
     // return res
     return res.json({
         success:true,
         message:"password reset succesfull"
     })
   } catch (error) {
        console.error(error);
        return res.status(403).json({
            success:false,
            message:"error occure during password reset"
        })
        
   }
}


    

