import { Course } from "../models/Course.js";
import {Section} from "../models/Section.js"
import { respond } from "../utils/response.js";
import { SubSection } from "../models/SubSection.js";

export const createSection = async (req,res) => {
    try {
        //fetch data
        const {sectionName, courseId} = req.body;
        //data validation
        if(!sectionName || !courseId) {
            return respond(res,"Missing fields",400,false)
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update course with section objectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true}
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();
        //use populate 
        return respond(res,"Creating section perfectly",200,true,updatedCourseDetails)
        
    }
    catch(error) {
        console.log(error)
        console.log(error.message)
        return respond(res,"Something went wrong while creating section",500,false)
    }
}

export const updateSection = async (req,res) => {
    try{

        //fetch data to update the section
        const {sectionName,sectionId,courseId} = req.body;

        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName},{new:true});

        const course = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            },
        }).exec()

        return respond(res,"Updating the section done",200,true,course)
    }
    catch(error) {
        console.log(error)
        return respond(res,"something went wrong while updating the section",500,true)
    }
}

export const deleteSection = async (req,res) => {
    try{

        //fetching the sectionid to delete the sectipo
        const {sectionId,courseId} = req.body;
        console.log("error",sectionId)
        await Course.findByIdAndUpdate(courseId,{
            $pull: {
                courseContent:sectionId,
            }
        })

        const section = await Section.findById(sectionId);
        
        if(!section) {
            return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
        }

        await SubSection.deleteMany({_id: {$in: section.subSection}});

        await Section.findByIdAndDelete(sectionId);

        const course = await Course.findById(courseId).populate({
            path:"courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();
        
        return res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
    }
    catch(error) {
        console.log(error)
        // return respond(res,"something went wrong while deleting the section",500,false)
        return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
    }
} 