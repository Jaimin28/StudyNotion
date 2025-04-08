const express = require("express");
const router = express.Router();

// import course controllers
const {
    createCourse,
    showAllCourses,
    getAllCourseDetails
} = require("../controllers/Course");
// import category controller
const {
    createCategory,
    showAllCategory,
    categoryPageDetails
} = require("../controllers/Categories");
// import section controller
const {
    createSection,
    updateSection,
    deleteSection
} = require("../controllers/Section");

// import subsection controller
const {
    createSubsection,
    updateSubSection,
    deleteSubSection
} =  require("../controllers/Subsection");
// import rating controller
const {
    createRating,getAverageRating,getAllReview
} = require("../controllers/RatingAndReview");
// import auth controller
const {
    auth,
    isStudent,
    isInstructor,
    isAdmin
} = require("../middlewares/auth");



// course Routes

// course only be created by instructor
// create course
router.post('/createCourse',auth,isInstructor,createCourse);
// add section to the course
router.post("/addSection",auth,isInstructor,createSection);
// update section
router.post('/updateSection',auth,isInstructor,updateSection);
// delete section
router.delete('/deleteSection',auth,isInstructor,deleteSection);
// add subsection
router.post('/addSubSection',auth,isInstructor,createSubsection);
// update subsection
router.post('/updateSubSection',auth,isInstructor,updateSubSection);
// delete Subsection
router.delete('/deleteSubSection/:subSectionId', auth, isInstructor, deleteSubSection);



// show all course
router.get('/showAllCourse',showAllCourses);
// get course details
router.post('/getCourseDetails',getAllCourseDetails);


// create category which only done by admin

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);

// rating and review routes

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllReview);


module.exports = router;