const Section = require("../models/Section");
const Course = require("../models/Course");


exports.createSection = async (req,res)=>{
    try {
        // fetch the data from req body
        const {sectionName,courseId} =  req.body;
        // validate the data

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All field are required"
            })
        }
        // creat section
        const newSection = await Section.create({sectionName});
        // update course with section id
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                                                        {
                                                                            $push:{
                                                                                courseContent:newSection._id,
                                                                            }
                                                                        },
                                                                        {
                                                                            new:true,
                                                                        }
                                                                ).populate({
                                                                    path:"courseContent",
                                                                    populate:{
                                                                        path:"subSection",
                                                                    },
                                                                });
    
    return res.status(200).json({
        success:true,
        message:"Section created succesfully",
        data:updatedCourseDetails
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Eroro occur while creating Section",
            error:error.message
        })
        
    }
};


// creat handler for update section

exports.updateSection = async (req,res) =>{
    try {
        // fetch the data
        const {sectionName,sectionId} = req.body;
        // validate
        if(!sectionId || !sectionName){
            return res.status(401).json({
                success:false,
                message:"All field are required"
            })
        };
        // update
        const updatedSection  = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        // return res
        return res.status(200).json({
            success:true,
            message:"Section Update Sucsessfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Eroro occur while Updating section",
            error:error.message
        })
    }
};



// create handler for delete section

exports.deleteSection = async (req,res) =>{
    try {
        // fetch the data - assuming that we are sending id in params
        const {sectionId} = req.params;
        // validate the data
        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:"All field are required"
            })
        };
        // delete section from db using id
        await Section.findByIdAndDelete(sectionId);
        // do we need to delete from course schema also
        return res.status(200).json({
            success:true,
            message:"Section successfully deleted"
        })
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            success:false,
            message:"Error occur while deleting section"
        })
        
    }
}