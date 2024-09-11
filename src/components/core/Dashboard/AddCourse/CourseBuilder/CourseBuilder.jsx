import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import IconBtn from "../../../../common/IconBtn"
import { IoAddCircleOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux';
import { MdNavigateNext } from 'react-icons/md';
import NestedView from './NestedView';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection,updateSection } from '../../../../../services/operations/courseDetailsAPI';

const CourseBuilder = () => {
    const {register,handleSubmit,setValue,formState:{errors},} = useForm();
    const {course} = useSelector((state) => state.course)
    const dispatch = useDispatch();
    const [loading,setLodaing] = useState(false)
    const {token} = useSelector((state) => state.auth)

    const [editSectionName , setEditSectionName] = useState(false) 

    const goBack = () => {
        dispatch(setStep(1))
        dispatch(setEditCourse(true))
    }

    const goToNext = () => {
        if(course.courseContent.length === 0) {
            toast.error("Please add atleast one section")
            return
        }
        if(course.courseContent.some((section) => section.subSection.length === 0))
        {
            toast.error("Please add atleast one lecture in each section")
            return
        }
        dispatch(setStep(3))
    }

    const handleChangeEditSectionName = (sectionId,sectionName) => {
        if(editSectionName === sectionId) {
            cancelEdit()
            return
        }
        setEditSectionName(sectionId)
        setValue("sectionName",sectionName)
    }

    const onSubmit = async (data) => {
        setLodaing(true)
        let result 
        if(editSectionName) {
            result = await updateSection({
                sectionName: data.sectionName,
                sectionId: editSectionName,
                courseId: course._id,
            },
            token
            )
        } else {
            result = await createSection(
                {
                    sectionName: data.sectionName,
                    courseId: course._id,
                },
                token
            )
        }
        if(result) {
            dispatch(setCourse(result))
            setEditSectionName(null)
            setValue("sectionName","")
        }
        setLodaing(false)
    }

    const cancelEdit = () => {
        setEditSectionName(null)
        setValue("sectionName", "")
    }
  return (
    <div className='space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
        <p className='text-2xl font-semibold text-richblack-5'>Course Buider</p>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='flex flex-col space-y-2'>
                <label className='text-sm text-richblack-5' htmlFor='sectionName'>
                    Section Name <sup className="text-pink-200">*</sup>
                </label>
                <input
                    id='sectionName'
                    disabled={loading}
                    placeholder='Add a section to build your course'
                    {...register("sectionName",{required:true})}
                    className='form-style w-full'
                />
                {errors.sectionName && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Section name is required</span>
                )}
            </div>
            <div className='flex items-end gap-x-4'>
                <IconBtn
                    type="submit"
                    disabled={loading}
                    text={editSectionName ? "Edit Section Name" : "Create Section"}
                    outline={true}
                >
                <IoAddCircleOutline size={20} className='text-yellow-50'/>
                </IconBtn>
                {editSectionName && (
                    <button
                    type='button'
                    onClick={cancelEdit}
                    className='text-sm text-richblack-300 underline'
                    >
                    Cancel Edit
                    </button>
                )}
            </div>
        </form>
        {course.courseContent.length > 0 && (
            <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
        )}
        <div className='flex justify-end gap-x-3'>
            <button onClick={goBack} className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>Back</button>
            <IconBtn text="Next" onclick={goToNext} disabled={loading}>
                <MdNavigateNext/>
            </IconBtn>
        </div>
    </div>
  )
}

export default CourseBuilder