import express from "express"
import { auth, isStudent } from "../middleware/auth.js";
import { capturePayment, sendPaymentSuccessEmail, verifyPayment} from "../controllers/Payment.js";

const route = express.Router();

route.post("/capturePayment",auth,capturePayment)

route.post("/verifyPayment",auth,isStudent,verifyPayment)

route.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

export default route;