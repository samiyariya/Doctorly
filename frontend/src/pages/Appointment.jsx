import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Appointment = () => {
  
  // storing docid for a particular doctor to show the appointment details
  const {docId} = useParams()
  const {doctors, currencySympol} = useContext(AppContext)

  // creating state variable to store other info of a doctor
  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  // fetch other info of a doctor using the docId
  const fetchDocInfo = async() => {
    // if the doc._id from doctor list is equal to the docId, value will be stored in docInfo variable
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }

  //we've to run this function whenever page gets reloaded. when any of doctors or docId changes, this function will run
  useEffect(() => {
    fetchDocInfo()
  },[doctors, docId])

  // we'll show the appointment details only if the docInfo is available
  return docInfo && (
    <div>
      {/* ----------------- Doctor Details ----------------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* ---------- Doc Info: name, degree, experience  ---------- */}
        <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
          {docInfo.name} 
          <img className='w-5' src={assets.verified_icon} alt="" />
        </p>
        <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
          <p>{docInfo.degree} - {docInfo.speciality}</p>
          <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
        </div>

        {/* ---------- Doctor About ---------- */}
        <div>
          <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
            About <img src={assets.info_icon} alt=""/>
          </p>
          <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
        </div>
        <p className='text-gray-500 font-medium mt-4'>
          Appointment fee: <span className='text-gray-600'>{currencySympol}{docInfo.fees}</span>
        </p>
        </div>
      </div>

    </div>
  )
}

export default Appointment