import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
        index: true,
    }
});

// export const RatingAndReview = mongoose.model("RatingAndReviews",ratingAndReviewSchema)
export const RatingAndReviews = mongoose.model("RatingAndReviews",ratingAndReviewSchema)