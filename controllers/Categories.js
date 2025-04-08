const Category = require("../models/category");

// create tag handler

exports.createCategory = async (req,res) =>{
    try {
        // fetch the data from req body

        const{name,description} = req.body;
        // validate the data
        if(!name || !description){
            return res.status(400).josn({
                success:false,
                message:"All fields are Required"
            })
        }
        // create entry in db
        const CategoryDetails = await Category.create({
            name:name,
            description:description
        })
        console.log(CategoryDetails);
        
        // return response
        res.status(200).json({
            success:true,
            message:"Category succesfully created"
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

exports.showAllCategory = async (req,res) =>{
    try {
        // find all tag entry from db
        const allTags = await Category.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:"all Category succesfully return",
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

// category page Detail

exports.categoryPageDetails = async (req,res)=>{
    try {
        // get category id
        const categoryId= req.body;

        // get courses for specified category id
        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();
        // validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data not found"
            })
        };
        // get courses for different categories
        const differentCategories = await Category.findById({_id:{$ne: categoryId}}).populate("courses").exec();

        // get top selling course
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}