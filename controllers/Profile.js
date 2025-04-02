const Profile = require("../models/Profile");
const User  = require("../models/User");


// creat handler for update profile

exports.updateProfile = async (req,res) =>{
    try {
        // fetch the data
        const {dateOfBirth="",about="",gender,contactNumber} = req.body;
        // fecth user id
        const id = req.user.id;
        // validate
        if(!gender || !contactNumber || !id){
            return res.status(403).json({
                success:false,
                message:"all fields are required"
            })
        };
        // find user
        const userDetails = await User.findById({_id:id});
        // find profile details
        const profileId = userDetails.additionalDetails;
        const profileDetails = await  Profile.findById({_id:profileId});

        // update data into profile
        profileDetails.dateOfBirth =dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        // save in db
        await profileDetails.save();
        // return res
        return res.status(200).json({
            success:true,
            message:"Data update succesfully",
            profileDetails,
        })

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Error occur during Updating the profile details"
        })
        
    }
}


// delete account handler

exports.deleteAccount = async (req,res) =>{
    try {
        // get id
        const id = req.user.id;
        // validate
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(403).json({
                success:false,
                message:"user not found"
            })
        }
        // profile delete
        const profileid =userDetails.additionalDetails;
        await Profile.findByIdAndDelete({_id:profileid});
        // hw remover user from enrolled student
        // delete user

        await User.findByIdAndDelete({_id:id});
        // return res
        return res.status(200).json({
            success:true,
            message:"Account delete succesfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Error occur during Delete account"
        })
    }

}

// get all user details
exports.getAllUserDetails = async (req,res) =>{
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:"user not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"User details fetch succesfully"
        }); 
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Error while fetching all user details"
        })
        
    }
}