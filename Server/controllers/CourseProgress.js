import { CourseProgress } from "../models/CourseProgress.js"
import { SubSection } from "../models/SubSection.js"
import { respond } from "../utils/response.js"

export const updateCourseProgress = async (req,res) => {
  console.log("body",req.body)
    const { courseId, subSectionId } = req.body
  const userId = req.user.id

  try{
    const subSection = await SubSection.findById(subSectionId)
    if (!subSection) {
        return respond(res,"Invalid subSecionId",404,false)
      }

    let courseProgress = await CourseProgress.findOne({
        courseID: courseId,
      userId: userId,
    })

    if(!courseProgress) {
        return respond(res,"course progress does not exist",404,false)
    } else{
        if(courseProgress.completedVideos.includes(subSectionId)) {
            return respond(res,"Subsection already completed",400,false)
        }
        courseProgress.completedVideos.push(subSectionId)

    }

    await courseProgress.save()

      return respond(res,"course progress updated",200,true,courseProgress)
  } catch(error) {
    console.log(error) 
    return respond(res,"Internal server error",500,false)
  }
}