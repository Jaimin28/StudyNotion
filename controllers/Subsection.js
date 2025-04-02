const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {imageUploadToCloudinary} = require("../utils/imageUploader");

// create handler for create subsection

exports.createSubsection = async (req,res)=> {
    try {
        // fetch the data
        const{title,timeDuration,description,sectionId} = req.body;
        const video = req.files.VideoFile;
        // validate the data
        if(!title || !timeDuration || !description || !sectionId){
            return res.status(404).json({
                success:false,
                message:"All fiels are required"
            })
        };
        // store video to cloudinary
        const videoStore = await imageUploadToCloudinary(video,process.env.FOLDER_NAME);

        // create entry in db of subsection
        const newSubSection = await SubSection.create({title:title,timeDuration:timeDuration,description:description,videoUrl:videoStore.secure_url});
        // update in section schema
        const updatedSectionDetails= await Section.findByIdAndUpdate(sectionId,
                                                                                {
                                                                                    $push:{
                                                                                        subSection:newSubSection._id
                                                                                    }
                                                                                },
                                                                                {
                                                                                    new:true
                                                                                }
        ).populate("subSection");
        console.log(updatedSectionDetails);
        

        // return res
        return res.status(200).json({
            success:true,
            message:"Subsection created succesfully",
            updatedSectionDetails
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Error occur while creatiing Subsection"
        })
        
    }
}


// update subsection handler

exports.updateSubSection = async (req,res) =>{
    try {
        // fetch the data
        const{title,timeDuration,description,subSectionId} = req.body;
        const video = req.files.VideoFile;
        // validate the data
        if(!title || !timeDuration || !description || !subSectionId){
            return res.status(404).json({
                success:false,
                message:"All fiels are required"
            })
        };
        // store video to cloudinary
        if(video){
            const videoStore = await imageUploadToCloudinary(video,process.env.FOLDER_NAME);
        }
        const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId,
                                                                                {
                                                                                    title:title,
                                                                                    timeDuration:timeDuration,
                                                                                    description:description,
                                                                                    videoUrl:videoStore.secure_url  
                                                                                },
                                                                                {new:true}
        );
        return res.status(200).json({
            success:true,
            message:"SubSection Update Sucsessfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(405).json({
            success:false,
            message:"Error occur while updating subsection"
        })
        
    }
};

// create handler for delete  subsection

exports.deleteSubSection = async (req,res) =>{
    try {
        // fetch SubSection id from req param
        const {subSectionId} = req.params
        // validate
        if(!subSectionId) {
            return res.status(401).json({
                success:false,
                message:"All field are required"
            })
        };
        // delete the subsection
        await SubSection.findByIdAndDelete(subSectionId);
        return res.status(200).json({
            success:true,
            message:"Subsection delete succesfully"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(405).json({
            success:false,
            message:"Error occur while Deleting subsection"
        })
    }
}