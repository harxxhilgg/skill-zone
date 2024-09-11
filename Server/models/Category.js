import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    course: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
],
})

export const Category = mongoose.model("Category",categorySchema)