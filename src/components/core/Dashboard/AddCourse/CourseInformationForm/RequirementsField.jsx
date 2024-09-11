import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const RequirementsField = ({name,label,register,errors,setValue}) => {
    
  const {editCourse,course} = useSelector((state) => state.course)
  const[requirement,setRequirement] = useState("")
  const [requirementsList,setRequirementsList] = useState([])

  useEffect(() => {
    if(editCourse) {
      setRequirementsList(course?.instructions)
    }
    register(name,{required:true,
    validate: (value) => value.length > 0})
  },[])

  useEffect(() => {
    setValue(name,requirementsList)
  },[requirementsList])

  const handleAddRequirement = () => {
    if(requirement) {
      setRequirementsList([...requirementsList,requirement])
      setRequirement("")
    }
  }

  const handleRemoveRequirement = (index) => {
    const updateRequirements = [...requirementsList]
    updateRequirements.splice(index,1)
    setRequirementsList(updateRequirements)
  }
  return (
    <div className='flex flex-col space-y-2'>
        <label htmlFor={name} className="text-sm text-richblack-5">
            {label} <sup className='text-pink-200'>*</sup>
        </label>
        <div className='flex flex-col items-start space-y-2'>
          <input
            type='text'
            id={name}
            placeholder='Enter instruction here'
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            className='form-style w-full'
          />
          <button type='button' onClick={handleAddRequirement} className='font-semibold text-yellow-50'>
              Add
          </button>
        </div>
        {requirementsList.length > 0 && (
          <ul className='mt-2 list-inside list-disc'>
            {requirementsList.map((requirement,index) => (
              <li key={index} className='flex items-center text-richblack-5'>
                <span>{requirement}</span>
                <button type='button' onClick={() => handleRemoveRequirement(index)} className='ml-2 text-xs text-pure-greys-300'>Clear</button>
              </li>
            ))}
          </ul>
        )}
        {errors[name] && (
          <span className='ml-2 text-xs tracking-wide text-pink-200'>{label} is required</span>
        )}
    </div>
  )
}

export default RequirementsField