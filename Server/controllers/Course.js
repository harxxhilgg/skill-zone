import {Course} from "../models/Course.js"
import { Category } from "../models/Category.js"
import { User } from "../models/User.js"
import { uploadImageToCloudinary } from "../utils/ImageUploder.js"
import { Section } from "../models/Section.js"
import { SubSection } from "../models/SubSection.js"
import { respond } from "../utils/response.js"
import dotenv from "dotenv"
import { CourseProgress } from "../models/CourseProgress.js"
import convertSecondsToDuration from "../utils/secToDuration.js"

dotenv.config();

//create course function
export const createCourse = async (req,res) => {
    try {
        //fetch data
        let {courseName,courseDescription,whatYouWillLearn,price,tag:_tag,category,status,instructions:_instructions} = req.body;

        //get thumbnail
        const thumbnail = req.files.
        thumbnailImage;

        console.log(req.files);

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)

        console.log("tag", tag)
        console.log("instructions", instructions)

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag.length || !thumbnail || !category || !instructions.length) {
            return respond(res,"Allfields are required",400,false);
        }

        if(!status || status === undefined) {
            status = "Draft"
        }

        //check for instructor 
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId,{
            accountType: "Instructor",
        });
        console.log("Instructor Details: ", instructorDetails)

        if(!instructorDetails) {
            return respond(res,"Instructor Details not found",404,false)
        }

        //check given category is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            return respond(res,"category details not found",404,false)
        }

        //upload Image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,courseDescription,instructor: instructorDetails._id,whatYouWillLearn:whatYouWillLearn,price,tag,
            category:categoryDetails._id, thumbnail:thumbnailImage.secure_url,status:status,instructions,
        })

        //add the new course the user schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {   
                $push: {
                    courses: newCourse._id
                }
            },
            {new: true}
        );

        // Add the new course to the Categories
        // const categoryDetailsadd = await Category.findByIdAndUpdate(
        //     {_id:category},
        //     {
        //         $push: {
        //             courses: newCourse._id,
        //         },
        //     },
        //     {new:true}
        // )
        const categoryDetails2 = await Category.findByIdAndUpdate(
            {_id: category},
    {
        $push : {
            course: newCourse._id,
        },
    },{new:true})
        console.log("HEREEEEEEEE", categoryDetails2)
        //update the Tag Schema

        return respond(res,"Course Created Successfully",200,true,newCourse)
    }
    catch(error) {
        console.log(error)
        console.log(error.message)
        return respond(res,"Something went wromg while creating the course",500,false)
    }
}

//get all courses function 

export const showAllCourses = async (req,res) => {
    try {
        const allCourses = await Course.find({status: "Published"} , {
            courseName:true,
            price:true,
            thumbnail:true,
            instructor: true,
            ratingAndReviews: true,
            studentEnrolled: true,
        }).populate("instructor").exec();

        return respond(res,"All courses find successfully",20,true,allCourses)
    }
    catch(error) {
        console.log(error)
        return respond(res,"Canot fetch all course",500,false)
    }
}

export const getCourseDetails = async (req,res) => {
    try{
        //get id
        const {courseId} = req.body;

        console.log("id",courseId)

        //find course details
        const courseDetails = await Course.findOne(
            {_id:courseId}).populate(
                {
                    path:"instructor",
                    populate: {
                        path:"additionalDetails"
                    }
                }
            )
            .populate("category")
            // .populate("ratingAndReviews")
            .populate({
                path:"courseContent",
                populate: {
                    path:"subSection",
                    select: "-videoUrl"
                },
            })
            .exec();

        //validation
        if(!courseDetails) {
            return respond(res,`Could not find the courses with ${courseId}`,400,false)
        }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)  
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
              courseDetails,
              totalDuration,
            },
          })
    }
    catch(error) {
        console.log(error)
        return respond(res,"Something went wrong while getting course details",500,false)
    }
}

export const editCourse = async (req,res) => {
    try{
        const {courseId} = req.body;
        const updates = req.body;
        const course = await Course.findById(courseId)

        if(!course) {
            return respond(res,"Course not found",404,false)
        }

        if (req.files) {
            console.log("thumbnail update")
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)
            course.thumbnail = thumbnailImage.secure_url
        }

        for (const key in updates) {
            if(updates.hasOwnProperty(key)) {
                if(key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key])
                } else {
                    course[key] = updates[key]
                }
            }
        }

        await course.save()

        const updatedCourse = await Course.findOne({
            _id:courseId,
        }).populate({
            path:"instructor",
            populate: {
                path:"additionalDetails",
            },
        }).populate("category")
        // .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate: {
                path:"subSection"
            },
        }).exec()

        return respond(res,"Course Updated Successfully",200,true,updatedCourse)
    }
    catch(error) {
        console.log(error)
        return respond(res,"Internal server error while updating the course",500,false)
    }
}

export const getInstructorCourses = async (req,res) => {
    try {
        const instructorId = req.user.id

        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({createdAt: -1})

        return respond(res,"All Courses Fetching Successfully of Particular Instructor",200,true,instructorCourses)
    }
    catch(error) {
        console.log(error)
        return respond(res,"Failed to retrieve instructor courses",500,false)
    }
}

export const deleteCourse = async(req,res) => {
    try{
        const {courseId} = req.body

        const course = await Course.findById(courseId)
        if(!course) {
            return respond(res,"Course not found",404,false)
        }

        const studentsEnrolled = course.studentsEnrolled 
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId,{
                $pull: {courses:courseId},
            })
        }

        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            const section = await Section.findById(sectionId)
            if(section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            await Section.findByIdAndDelete(sectionId)
        }

        await Course.findByIdAndDelete(courseId)

        return respond(res,"Course deleted successfully",200,true)
    }
    catch(error) {
        console.log(error)
        return respond(res,"Server error while deleting the course",500,false)
    }
}

export const getFullCourseDetails = async (req,res) => {
    try{
        const {courseId} = req.body
        const userId = req.user.id 
        const courseDetails = await Course.findOne({
            _id:courseId,
        }).populate({
            path:"instructor",
            populate:{
                path:"additionalDetails",
            },
        }).populate("category")
        // .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate: {
                path:"subSection",
            },
        }).exec()

        console.log("course Details", courseDetails)

        let courseProgressCount = await CourseProgress.findOne({
            courseId:courseId,
            userId: userId,
        })

        console.log("courseProgressCount : ", courseProgressCount)

        if(!courseDetails) {
            return respond(res,"Could not find course with this courseId",404,false)
        }

        let totalDurationInSeconds = 0 
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds+=timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
              courseDetails,
              totalDuration,
              completedVideos: courseProgressCount?.completedVideos
                ? courseProgressCount?.completedVideos
                : [],
            },
          })
    }
    catch(error) {
        return respond(res,`${error.message}`,500,false)
    }
}

export const instructorDashboard = async(req,res) => {
    try{
        const courseDetails = await Course.find({instructor: req.user.id})

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,totalAmountGenerated
            }

            return courseDataWithStats
        })

        return respond(res,"instructor dashboard data fetched",200,true,courseData)
    } catch(error) {
        console.log(error) 
        return respond(res,"server error while getting the instructor dashbaoard data",500,false)
    }
}

export const getAllCourses = async(req,res) => {
    try{
        const allCourses = await Course.find(
            {status:"Published"},
            {
                courseName:true,
                price:true,
                thumbnail:true,
                instructor:true,
                ratingAndReviews:true,
                studentsEnrolled:true,
            }
        ).populate("instructor").exec()

        return respond(res,"all courses fetched",200,true,allCourses)
     } catch(error) {
        console.log(error) 
        return respond(res,"can't fetch all courses data",500,false)
     }
}