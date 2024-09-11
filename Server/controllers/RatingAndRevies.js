import { RatingAndReviews } from "../models/RatingAndReviews.js";
import { Course } from "../models/Course.js";
import { respond } from "../utils/response.js";
import mongoose from "mongoose";

export const createRating = async (req,res) => {
    try {
        //get user id
        const userId =  req.user.id;

        //fetch data from the body
        const {rating,review,courseId} = req.body;

        //check if user is enrooled or not
        const courseDetails = await Course.findOne(
            {_id: courseId,studentsEnrolled: {$elemMatch: {$eq: userId}},
            });
        
        if(!courseDetails) {
            return respond(res,"Student is not enrolled in tis course",404,false)
        }

        //check if user already reviewd the course
        const alreadyReviewd = await RatingAndReviews.findOne(
            {
                user: userId,
                course: courseId,
            }
        );

        if(alreadyReviewd) {
            return respond(res,"Course is already reviewd and rainng by the user",403,false)
        }

        //create rating and review
        const ratingAndReview = await RatingAndReviews.create(
            {
                rating,review,course:courseId,
                user:userId,
            }
        );

        //update course with this rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},{
            $push: {
                ratingAndReviews: ratingAndReview._id,
            }
        },{new:true}
        );

        return respond(res,"Rating and review given successfully to the particular course",200,true);
    }
    catch(error) {
        console.log(error)
        return respond(res,"Something went wrong while giving rating and review",500,false)
    }
}

export const getAveragerating = async (req,res) => {
    try{
        //get course id
        const courseId = req.body.courseId;

        //calculating avg rating 

        const result = await RatingAndReviews.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])

        //return rating
        if(result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        //if no rating/review exist

        return res.status(200).json({
            success: true,
            averageRating: result[0].averageRating,
        })
    }
    catch(error){
        console.log(error)
        return respond(res,"Soemthing went wrong while getting Average rating",500,false)
    }
}

export const getAllRatingAndReviews = async (req,res) => {
    try{
        const allReviews = await RatingAndReviews.find({}).sort({rating: "desc"}).populate({
            path:"user",
            select:"firstName lastName email image"
        }).populate({
            path:"course",
            select:"CourseName",
        }).exec();

        return respond(res,"all reviews fetched successfully",200,true,allReviews)

    }
    catch(error) {
        console.log(error)
        return respond(res,"Soemthing went wrong while getting all rating and review",500,false)
    }
}