import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    timeDuration: {
        type: String,
    },
    description: { 
        type: String,
    },
    videourl: {
        type: String,
    },
});

export const SubSection = mongoose.model("SubSection",subSectionSchema)