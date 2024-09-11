import express from "express"
import { auth, isStudent, isAdmin, isInstructor} from "../middleware/auth.js";
import {categoryPageDetails, createCategory, showAllCategory} from "../controllers/Category.js";
import { createCourse, deleteCourse, editCourse, getFullCourseDetails, getInstructorCourses, getCourseDetails, getAllCourses } from "../controllers/Course.js";
import { createSection, deleteSection, updateSection } from "../controllers/Section.js";
import { createSubSection, deleteSubsection, updateSubsection } from "../controllers/SubSection.js";
import { createRating,getAveragerating, getAllRatingAndReviews} from "../controllers/RatingAndRevies.js";
import { updateCourseProgress } from "../controllers/CourseProgress.js";

const router = express.Router();

// Category can Only be Created by Admin
router.post("/createCategory",auth,isAdmin,createCategory)
router.get("/showAllCategory",showAllCategory)
router.post("/getCategoryPageDetails",categoryPageDetails)

// Courses can Only be Created by Instructors
router.post("/createCourse",auth,isInstructor,createCourse)
router.post("/getCourseDetail",getCourseDetails)
router.post("/addSection",auth,isInstructor,createSection)
router.post("/updateSection",auth,isInstructor,updateSection)
router.delete("/deleteSection",auth,isInstructor,deleteSection)
router.post("/addsubsection",auth,isInstructor,createSubSection)
router.post("/editCourse",auth,isInstructor,editCourse)
router.post("/updatesubsection",auth,isInstructor,updateSubsection)
router.delete("/deletesubsection",auth,isInstructor,deleteSubsection)
router.get("/getInstructorCourses",auth,isInstructor,getInstructorCourses)
router.delete("/deleteCourse",deleteCourse)
router.post("/getFullCourseDetails",auth,getFullCourseDetails)
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAveragerating)
router.get("/getReviews", getAllRatingAndReviews)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
router.get("/getAllCourses", getAllCourses)
export default router;