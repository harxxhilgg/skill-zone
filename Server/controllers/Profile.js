import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import { uploadImageToCloudinary } from "../utils/ImageUploder.js";
import { respond } from "../utils/response.js";
import dotenv from "dotenv"
import { CourseProgress } from "../models/CourseProgress.js";

dotenv.config();

export const updateProfile = async (req,res) => {
    try{
        //get data
        const {firstName = "", lastName = "",dateOfBirth="",about="",contactNumber="",gender=""} = req.body

        //get userId
        const userId = req.user.id;

        //find profile 
        const userDetails = await User.findById(userId)
        const profile = await Profile.findById(userDetails.additionalDetails);

        const user = await User.findByIdAndUpdate(userId,{
            firstName,lastName,
        })
        await user.save()
        
        //update Prodile data
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.gender = gender;
        profile.contactNumber = contactNumber;
        await profile.save();

        const updatedUserDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

        return respond(res,"profile updated successfully",200,true,updatedUserDetails)
    }
    catch(error) {
        console.log(error)
        return respond(res,"something went wroong while updating the profile",500,false)
    }
}

export const deleteAccount = async (req,res) => {
    try {
        //get id
        const id = req.user.id

        //validation 
        const userDetails = await User.findById(id);
        if(!userDetails) {
            return respond(res,"User not found",400,false)
        }

        //delete profile 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        //delete user 
        await User.findByIdAndDelete({_id:id})

        return respond(res,"Deteting account successfully",200,true)
    }
    catch(error) {
        console.log(error)
        return respond(res,"Something went wrong while deleteing the account",500,false)
    }
} 

export const getUserDetail = async (req,res) => {
    try {
        //get id
        const id = req.user.id

        //validation 
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        if(!userDetails) {
            return respond(res,"User not found",400,false)
        }

        return respond(res,"Getting all additionaldetails of user is done",200,true,userDetails)
    }
    catch(error) {
        return respond(res,"something went wrong while getting all details of user",500,false)
    }
}

export const updateDisplayPicture = async(req,res) => {
    try{
        const displayPicture = req.files.displayPicture

        const userId = req.user.id

        const image = await uploadImageToCloudinary(displayPicture,process.env.FOLDER_NAME,1000,1000)

        console.log(image);

        const updateProfile = await User.findByIdAndUpdate(
            {_id: userId},
            {image: image.secure_url},
            {new: true}
        )

        respond(res,"Image updated successfully",200,true,updateProfile)
    }
    catch(errro) {
        console.log(errro);
        return respond(res,"Something went wrong while updating the display image",500,false)
    }
}

// export const getEnrolledCourses = async (req,res) => {
//     console.log("HELLOOOO1111........")
//     console.log("id.....:",req.user.id)
//     try{
//         const userId = req.user.id
//         let userDetails = await User.findById(
//             userId).populate({
//             path:"course",
//             populate:{
//                 path:"courseContent",
//                 populate:{
//                     path:"subSection",
//                 }
//             }
//         }).exec()

//         console.log("HELLOOOO2222........")

//         userDetails = userDetails.toObject()

//         var subSectionLength = 0
//         for(var i=0; i < userDetails.courses.length; i++) {
//             let totalDurationInSeconds = 0
//             subSectionLength = 0
//             for(var j = 0; userDetails.courses[i].courseContent.length; j++) {
//                 totalDurationInSeconds += userDetails.courses[i].courseContent[
//                     j
//                   ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
//                   userDetails.courses[i].totalDuration = convertSecondsToDuration(
//                     totalDurationInSeconds
//                   )
//                   subSectionLength +=
//                     userDetails.courses[i].courseContent[j].subSection.length
//                 }
//                 let courseProgressCount = await CourseProgress.findOne({
//                   courseID: userDetails.courses[i]._id,
//                   userId: userId,
//                 })
//                 courseProgressCount = courseProgressCount?.completedVideos.length
//                 if (subSectionLength === 0) {
//                   userDetails.courses[i].progressPercentage = 100
//                 } else {
//                   // To make it up to 2 decimal point
//                   const multiplier = Math.pow(10, 2)
//                   userDetails.courses[i].progressPercentage =
//                     Math.round(
//                       (courseProgressCount / subSectionLength) * 100 * multiplier
//                     ) / multiplier
//                 }
//             }

//             if(!userDetails) {
//                 return respond(res,`Could not find user with id: ${userDetails}`,400,false)
//             }

//             console.log("HELLOOOO3333........")

//             return respond(res,"enrolled courses fetched",200,true,userDetails)
//         } catch(error) {
//             return respond(res,"something went wrong while getting enrolled courses",500,false)
//         }
//     }

// import { Profile } from "../models/Profile.js";
// import { User } from "../models/User.js";
// import { CourseProgress } from "../models/CourseProgress.js"; // Assuming this is imported from the correct path
// import { respond } from "../utils/response.js";
// import dotenv from "dotenv";

// dotenv.config();

const convertSecondsToDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
};

export const getEnrolledCourses = async (req, res) => {
    console.log("HELLOOOO1111........");
    console.log("id.....:", req.user.id);
    try {
        const userId = req.user.id;
        let userDetails = await User.findById(userId).populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            },
        }).exec();

        console.log("HELLOOOO2222........",userDetails);

        if (!userDetails) {
            return respond(res, `Could not find user with id: ${userId}`, 400, false);
        }

        userDetails = userDetails.toObject();

        for (let i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0;
            let subSectionLength = 0;
            for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce(
                    (acc, curr) => acc + parseInt(curr.timeDuration),
                    0
                );
                subSectionLength += userDetails.courses[i].courseContent[j].subSection.length;
            }
            userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);

            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            });
            courseProgressCount = courseProgressCount ? courseProgressCount.completedVideos.length : 0;

            if (subSectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100;
            } else {
                const multiplier = Math.pow(10, 2);
                userDetails.courses[i].progressPercentage =
                    Math.round((courseProgressCount / subSectionLength) * 100 * multiplier) / multiplier;
            }
        }

        console.log("HELLOOOO3333........");

        return res.status(200).json({
            success: true,
            data: userDetails.courses,
          })
    } catch (error) {
        console.log(error);
        return respond(res, "Something went wrong while getting enrolled courses", 500, false);
    }
};
