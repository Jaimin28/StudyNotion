const Tag = require("../models/tags");

// create tag handler

exports.createTag = async (req,res) =>{
    try {
        // fetch the data from req body

        const{name,description} = req.boyd;
        // validate the data
        if(!name || !description){
            return res.status(400).josn({
                success:false,
                message:"All fields are Required"
            })
        }
        // create entry in db
        const tagDetails = await Tag.create({
            name:name,
            description:description
        })
        console.log(tagDetails);
        
        // return response
        res.status(200).json({
            success:true,
            message:"Tag succesfully created"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}


// getall tags handler

exports.showAlltag = async (req,res) =>{
    try {
        // find all tag entry from db
        const allTags = await Tag.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:"all tags succesfully return",
            allTags,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}