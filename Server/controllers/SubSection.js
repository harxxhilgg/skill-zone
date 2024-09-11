import {SubSection} from "../models/SubSection.js" 
import { Section } from "../models/Section.js"
import { respond } from "../utils/response.js" 
import { uploadImageToCloudinary } from "../utils/ImageUploder.js"
import dotenv from "dotenv"

dotenv.config();

export const createSubSection = async (req,res) => {
    try {
        //fetch data 
        const {sectionId,title,description} = req.body

        //extract video/file
        const video = req.files.video;

        //validation
        if(!sectionId || !title || !description || !video) {
            return respond(res,"All fields are required",400,false)
        }

        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

        //create a sub-section
        const subSectionDetails = await SubSection.create({
            title,timeDuration:`${uploadDetails.duration}`,description,videourl:uploadDetails.secure_url
        })

        //update section with this sub section objectId
        const updatedSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {$push:{
                subSection:subSectionDetails._id,
            }},
            {new:true}
            ).populate("subSection");
        return respond(res,"creating the subsection is done",200,true,updatedSection)
    }
    catch(error) {
        console.log(error)
        return respond(res,"Something went wrong while creating the subsection",500,false,updateSubsection)
    }
}

export const updateSubsection = async (req,res) => {
    try{
        const{title,description,sectionId,subSectionId} = req.body;

        const subSection = await SubSection.findById(subSectionId)

        if(!subSection) {
            return respond(res,"subSection not found",404,false)
        }

        if(title !== undefined) {
            subSection.title = title
        }

        if(description !== undefined) {
            subSection.description = description
        }

        if(req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
            subSection.videourl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save()

        const updatedSection = await Section.findById(sectionId).populate("subSection").exec()

        console.log("updated section",updatedSection)

        return respond(res,"Subsection updated successfully",200,true,updatedSection)
    }
    catch(error) {
        console.log(error)
        return respond(res,"Soemthing went wrong while updating the subsection",500,false)
    }
}

export const deleteSubsection = async (req,res) => {
    try {
        const {subSectionId,sectionId} = req.body;
        await Section.findByIdAndUpdate({_id: sectionId},{
            $pull: {
                subSection:subSectionId
            },
        })

        const subSection = await SubSection.findByIdAndDelete({
            _id: subSectionId
        })

        if (!subSection) {
            return respond(res,"SubSection not found",404,false)
        }

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return respond(res,"Subsection deleting successfully",200,true,updatedSection)
    }
    catch(error) {
        console.log(error)
        return respond(res,"Something went wrong while deleting th subsetion",500,false)
    }
}