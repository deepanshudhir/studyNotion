// Import the required modules
const express = require("express");
const router = express.Router();

// ================== CONTROLLERS ==================

// Course Controllers
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course");

// Category Controllers
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Section Controllers
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// ✅ FIXED (IMPORTANT - Correct file name)
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

// Rating Controllers
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../controllers/RatingandReview");

// Course Progress Controllers
const {
  updateCourseProgress,
  getProgressPercentage,
} = require("../controllers/courseProgress");

// ================== MIDDLEWARE ==================
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

// ******************************************************************
//                        COURSE ROUTES
// ******************************************************************

// Create Course (Instructor only)
router.post("/createCourse", auth, isInstructor, createCourse);

// Edit Course
router.post("/editCourse", auth, isInstructor, editCourse);

// Section Routes
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);

// SubSection Routes
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Instructor Courses
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

// Public Courses
router.get("/getAllCourses", getAllCourses);

// Course Details
router.post("/getCourseDetails", getCourseDetails);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);

// Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage);

// Delete Course
router.delete("/deleteCourse", deleteCourse);

// ******************************************************************
//                        CATEGORY ROUTES
// ******************************************************************

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ******************************************************************
//                    RATING & REVIEW ROUTES
// ******************************************************************

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview);

// Export router
module.exports = router;