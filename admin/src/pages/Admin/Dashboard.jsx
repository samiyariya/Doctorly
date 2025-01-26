import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const {aToken, getDashData, cancelAppointment, dashData} = useContext(AdminContext)
  const {slotDateFormat} = useContext(AppContext)

  useEffect(()=>{
    if(aToken){
      getDashData()
    }
  },[aToken])

  return dashData && (
    <div className='m-5'>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {[
    {
      title: "Doctors",
      value: dashData.doctors,
      icon: assets.doctor_icon,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
    },
    {
      title: "Appointments",
      value: dashData.appointments,
      icon: assets.appointments_icon,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-600",
    },
    {
      title: "Patients",
      value: dashData.patients,
      icon: assets.patients_icon,
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      textColor: "text-pink-600",
    },
  ].map((item, index) => (
    <div
      key={index}
      className={`flex items-center gap-4 p-6 rounded-lg border ${item.bgColor} ${item.borderColor} shadow-md transform hover:scale-105 transition-transform duration-200 cursor-pointer`}
    >
      <img className="w-16 h-16" src={item.icon} alt={item.title} />
      <div>
        <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
        <p className="text-gray-500">{item.title}</p>
      </div>
    </div>
  ))}
</div>



<div className='w-full max-w-6xl m-5'>
  <p className='mb-3 text-lg font-medium'>All Appointments</p>
  <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
    
    {/* Header for larger screens */}
    <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
      <p>#</p>
      <p>Patient</p>
      <p>{/*Age*/}</p>
      <p>Date & Time</p>
      <p>Doctor</p>
      <p>Fees</p>
      <p>Actions</p>
    </div>

    {/* Booking List */}
    {dashData.latestAppointments.map((item, index) => (
      <div
        key={index}
        className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
      >
        {/* Index for larger screens */}
        <p className='max-sm:hidden'>{index + 1}</p>

        {/* Patient Info */}
        <div className='flex items-center gap-2'>
          <img className='w-8 rounded-full' src={item.userData.image} alt="Patient" />
          <p>{item.userData.name}</p>
        </div>

        {/* Age (Optional) */}
        <p className='max-sm:hidden'>
          {/* You can calculate the age here */}
          {/* calculateAge(item.userData.dob) */}
        </p>

        {/* Date & Time */}
        <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

        {/* Doctor Info */}
        <div className='flex items-center gap-2'>
          <img className='w-8 rounded-full bg-teal-500' src={item.docData.image} alt="Doctor" />
          <p>{item.docData.name}</p>
        </div>

        {/* Fees */}
        {/* <p>{currency} {item.amount}</p> */}

        {/* Status */}
        {
          item.cancelled
            ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
            : item.isCompleted
              ? <p className='text-green-500 text-xs font-medium'>Completed</p>
              : <p className="text-blue-500 text-xs font-medium">Booked</p>
        }

        {/* Actions */}
        {/* Optional: add an action for canceling or editing */}
        {/* 
        {!item.cancelled && !item.isCompleted && (
          <img
            onClick={() => cancelAppointment(item._id)}
            className='w-10 cursor-pointer'
            src={assets.cancel_icon}
            alt="Cancel Icon"
          />
        )}
        */}
      </div>
    ))}

  </div>
</div>



    </div>
  )
}

export default Dashboard