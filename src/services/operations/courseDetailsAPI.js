import { apiConnector } from "../apiconnector"
import { categories } from "../apis"
import toast from "react-hot-toast"
import { courseEndpoints } from "../apis"

const {CATEGORIES_API} = categories
const {CREATE_COURSE_API,EDIT_COURSE_API,CREATE_SECTION_API,UPDATE_SECTION_API,DELETE_SECTION_API,CREATE_SUBSECTION_API,UPDATE_SUBSECTION_API,DELETE_SUBSECTION_API,GET_ALL_INSTRUCTOR_COURSES_API,DELETE_COURSE_API,GET_FULL_COURSE_DETAILS_AUTHENTICATED,COURSE_CATEGORIES_API,GET_COURSE_DETAILS_API, CREATE_RATING_API,LECTURE_COMPLETION_API,GET_ALL_COURSE_API} = courseEndpoints

export const fetchCourseCategories = async () => {
    let result = []
    try{
        const response = await apiConnector("GET",COURSE_CATEGORIES_API)
        console.log("COURSE_CATEGORIES_API API RESPONSE............", response)
        if(!response?.data?.success) {
            throw new Error("Could Not Fetch Course Categories")
        }
        result = response?.data?.data
    }
    catch(error) {
        console.log("COURSE_CATEGORY_API API ERROR............", error)
        toast.error(error.message)
    }
    return result
}

export const addCourseDetails = async (data,token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    console.log("Course Data : ",data);
    try{
        const response = await apiConnector("POST",CREATE_COURSE_API,data, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })
        console.log("CREATE COURSE API RESPONSE............", response)
        if(!response?.data?.success) {
            throw new Error("Could Not Add Course Details")
        }
        toast.success("Course Details Added Successfully")
        result = response?.data?.data
    }
    catch(error) {
        console.log("CREATE COURSE API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const editCourseDetails = async (data,token)  => {
    let result = null
    const toastId =  toast.loading("Loading...")
    try{
        const response = await apiConnector("POST",EDIT_COURSE_API,data,{
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })
        console.log("EDIT COURSE API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Update Course Details")
        }
        toast.success("COurse Details Updated Successfully")
        result = response?.data?.data
    }
    catch(error) {
        console.log("EDIT COURSE API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const createSection = async (data,token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST",CREATE_SECTION_API,data,{
            Authorization: `Bearer ${token}`,
        })
        console.log("CREATE SECTION API RESPONSE............", response)
        if(!response?.data?.success) {
            throw new Error("Could Not Create Section")
        }
        toast.success("Course Secion Created")
        result = response?.data?.data
    }
    catch(error) {
        console.log("CREATE SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const updateSection = async (data,token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST",UPDATE_SECTION_API,data,{
            Authorization: `Bearer ${token}`,
        })
        console.log("UPDATE SECTION API RESPONSE............", response)
        if(!response?.data?.success) {
            throw new Error("Could not update section")
        }
        toast.success("Course Section Updated")
        result = response?.data?.data
    }
    catch(error) {
        console.log("UPDATE SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const deleteSection = async (data,token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("DELETE",DELETE_SECTION_API,data,{
            Authorization: `Bearer ${token}`,
        })
        console.log("DELETE SECTION API RESPONSE............", response)
        if(!response?.data?.success) {
            throw new Error("Could not delete section")
        }
        toast.success("Course Section Deleted")
        result = response?.data?.data
    }
    catch(error) {
        console.log("DELETE SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const createSubSection = async (data,token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("POST",CREATE_SUBSECTION_API,data,{
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })
        console.log("CREATE SUB-SECTION API RESPONSE............", response)
        if(!response?.data?.success) {
            throw new Error("Could not add lecture")
        }
        toast.success("Lecture Added")
        result = response?.data?.data
    }
    catch(error) {
        console.log("CREATE SUB-SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const updateSubSection = async (data,token) => {
   let result = null
   const toastId = toast.loading("Loading...")
   try {
    const response = await apiConnector("POST",UPDATE_SUBSECTION_API,data,{
        Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SUBSECTION API RESPONSE............", response)
    if(!response?.data?.success) {
        throw new Error("Could not update subsection")
    }
    toast.success("Lecture Updated")
    result = response?.data?.data
   }
   catch(error) {
    console.log("UPDATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
   }
   toast.dismiss(toastId)
   return result
}

export const deleteSubSection = async (data,token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("DELETE",DELETE_SUBSECTION_API,data,{Authorization: `Bearer ${token}`,})
        console.log("DELETE SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could not delete subsection")
        }
        toast.success("Lecture deleted")
        result = response?.data?.data
    }
    catch(error) {
        console.log("DELETE SUB-SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const fetchInstructorCourses = async(token) => {
    let result = []
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("GET",GET_ALL_INSTRUCTOR_COURSES_API,null,{
            Authorization: `Bearer ${token}`, 
        })
        console.log("INSTRUCTOR COURSES API RESPONSE............", response)
        if(!response?.data?.success) {
            throw new Error("Could not fetch instructor courses")
        }
        result = response?.data?.data
        console.log("result",result)
    }
    catch(error) {
        console.log("INSTRUCTOR COURSES API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const deleteCourse = async (data,token) => {
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("DELETE",DELETE_COURSE_API,data,{
            Authorization: `Bearer ${token}`, 
        })
        console.log("DELETE COURSE API RESPONSE............", response)
        if(!response?.data?.success) {
            throw new Error("Could not delete course")
        }
        toast.success("course deleted")
    }
    catch(error) {
        console.log("DELETE COURSE API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
}

export const getFullDetailsOfCourse = async (courseId,token) => {
    const toastId = toast.loading("Loading...")
    let result = null
    try{
        const response = await apiConnector("POST",GET_FULL_COURSE_DETAILS_AUTHENTICATED,{courseId},{Authorization: `Bearer ${token}`,})

        console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)

        if(!response.data.success) {
            throw new Error(response.data.message) 
        }

        result = response?.data?.data
    }
    catch(error) {
        console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
        result = error.response.data
    }
    toast.dismiss(toastId)
    return result
}

export const fetchCourseDetails = async(courseId) => {
    const toastId = toast.loading("Loading...")
    let result = null
    console.log("id",courseId)
    try{
        const response = await apiConnector("POST",GET_COURSE_DETAILS_API, {
            courseId,
        })
        console.log("COURSE_DETAILS_API API RESPONSE............", response)

        if (!response.data.success) {
            throw new Error(response.data.message)
          }
          result = response.data
    }catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error)
    result = error.response.data
    }
    toast.dismiss(toastId)
    return result
}

export const createRating = async (data,token) => {
    const toastId = toast.loading("Loading...")
  let success = false
  try{
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log("CREATE RATING API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Create Rating")
      }
      toast.success("Rating Created")
      success = true
  }catch (error) {
    success = false
    console.log("CREATE RATING API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}
 
export const markLectureAsComplete = async(data,token) => {
    let result = null
  console.log("mark complete data", data)
  const toastId = toast.loading("Loading...")
  try{
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log(
        "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
        response
      )
  
      if (!response.data.message) {
        throw new Error(response.data.error)
      }
      toast.success("Lecture Completed")
      result = true
  }catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
    toast.error(error.message)
    result = false
  }
  toast.dismiss(toastId)
  return result
}

export const getAllCourses = async() => {{
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiConnector("GET", GET_ALL_COURSE_API)
        if (!response?.data?.success) {
          throw new Error("Could Not Fetch Course Categories")
        }
        result = response?.data?.data
      } catch (error) {
        console.log("GET_ALL_COURSE_API API ERROR............", error)
        toast.error(error.message)
      }
      toast.dismiss(toastId)
      return result
}}