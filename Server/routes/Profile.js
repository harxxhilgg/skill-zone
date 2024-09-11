import express from "express"
import { auth, isInstructor } from "../middleware/auth.js";
import { deleteAccount, getEnrolledCourses, getUserDetail, updateDisplayPicture, updateProfile } from "../controllers/Profile.js";
import { instructorDashboard } from "../controllers/Course.js";

const router = express.Router();

router.put("/updateDisplayPicture",auth,updateDisplayPicture)
router.put("/updateProfile",auth,updateProfile)
router.get("/getUserDetail",auth,getUserDetail)
router.delete("/deleteProfile",auth,deleteAccount)
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)
export default router;