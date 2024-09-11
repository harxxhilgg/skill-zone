import { instance } from "../config/razorpay.js";
import { Course } from "../models/Course.js";
import { User } from "../models/User.js";
import mailsender from "../utils/mailSender.js";
import crypto from "crypto";
import { respond } from "../utils/response.js";
import mongoose from "mongoose";
import { CourseProgress } from "../models/CourseProgress.js";
import {courseEnrollmentEmail} from "../mail/templates/courseEnrollmentEmail.js"
import { paymentSuccessEmail } from "../mail/templates/paymentSuccessEmail.js";
import dotenv from "dotenv"

dotenv.config();

// Capture the payment and initiate the Razorpay order
export const capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;
  if (courses.length === 0) {
    return respond(res, "Please Provide Course ID", 404, false);
  }

  let total_amount = 0;

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);

      if (!course) {
        return respond(res, "Could not find the Course", 404, false);
      }

      console.log("hellooooeee",userId)

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return respond(res, "Student is already Enrolled", 400, false);
      }

      console.log("hellooooeee",uid)

      total_amount += course.price;
      console.log("amount.....",total_amount)
    } catch (error) {
      console.log(error);
      return respond(
        res,
        "something went wrong while capturing the payment",
        500,
        false
      );
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    return respond(
      res,
      "payment initilization is done",
      200,
      true,
      paymentResponse
    );
  } catch (error) {
    console.log(error);
    return respond(res, "Could not initiate order.", 500, false);
  }
};

// verify the payment
export const verifyPayment = async (req, res) => {


  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;

  const userId = req.user.id;

  console.log("Request Body: ", req.body);

  console.log("orderid.......",razorpay_order_id)
  console.log("signature....",razorpay_signature)

  // if (
  //   !razorpay_order_id ||
  //   !razorpay_payment_id ||
  //   !razorpay_signature ||
  //   !courses ||
  //   !userId
  // ) {
  //   return respond(res, "payment failed", 400, false);
  // }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "3qooRrtYWMtj5mCTy1uFMZxI")
    .update(body.toString())
    .digest("hex");

    console.log("hello...............",expectedSignature)

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return respond(res, "payment verified", 200, true);
  }

  return respond(res, "Payment failed due to some error", 500, false);
};

export const sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return respond(res, "Please provide all the details", 400, false);
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailsender(
      enrolledStudent.email,
      `Paymnet Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log(error);
    return respond(res, "could not send email", 500, false);
  }
};

export const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return respond(res, "Please Provide Course ID and User ID", 400, false);
  }

  // const userId = req.user.id

  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },

        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return respond(res, "course not found", 404, false);
      }
      console.log("Updated course: ", enrolledCourse);

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgess: courseProgress._id,
          },
        },
        { new: true }
      );

      console.log("Enrolled student: ", enrolledStudent);

      const emailResponse = await mailsender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );
      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      return respond(
        res,
        "something went wrong while enrolled the course to student",
        500,
        false
      );
    }
  }
};
