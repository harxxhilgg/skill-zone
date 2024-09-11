import React from 'react'
import { useSelector } from 'react-redux'
import frameImg from "../../../assets/Images/frame.png"
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'

const Template = ({title, description1, description2, image, formType }) => {
  const {loading} = useSelector((state) => state.auth)
  return (
    <div className='min-h-[calc(100vh-3.5rem)] place-items-center'>
        {loading ? (<div className='spinner'></div>) : (
        <div className='mx-auto flex w-11/12 max-w-maxContent justify-between items-center gap-y-12 py-12'>
        <div className='mx-auto w-11/12 max-w-[440px]'>
        <h1 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5'>
            {title}
          </h1>
          <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
          <span className="text-richblack-100">{description1}</span>{" "}
          <span className="font-edu-sa font-bold italic text-blue-100">{description2}</span>
          </p>
          {formType === "signup" ? <SignupForm/> : <LoginForm/>}
        </div>
        <div className='relative mx-auto w-11/12 max-w-[450px]'>
        <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
            />
            <img
              src={image}
              alt="Students"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 z-10"
            />
        </div>
        </div>
        )}
    </div>
  )
}

export default Template