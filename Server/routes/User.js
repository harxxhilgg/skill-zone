import express from "express"

const router = express.Router();

import { login,signUp,changePassword,sendOTP } from "../controllers/Auth.js";

import { resetPasswordToken,resetPasswordUpdate } from "../controllers/ResetPassword.js";

import { auth } from "../middleware/auth.js";
import { contactUsController } from "../controllers/ContactUs.js";

router.post("/login",login);

router.post("/signup",signUp);

router.post("/sendotp",sendOTP);

router.post("/changepassword",auth,changePassword);

router.post("/reset-password-token",resetPasswordToken);

router.post("/reset-password-update",resetPasswordUpdate);

router.post("/contactus",contactUsController)

router.post("/changepassword",auth,changePassword)
export default router;