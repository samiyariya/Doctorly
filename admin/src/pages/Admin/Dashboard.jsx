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



<div className="bg-white py-8 rounded-lg shadow-md">
  {/* Header */}
  <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b rounded-t-lg">
    <img className="w-5" src={assets.list_icon} alt="List Icon" />
    <p className="text-lg font-semibold text-gray-700">Bookings</p>
  </div>

  {/* Booking List */}
  <div className="divide-y divide-gray-200">
    {dashData.latestAppointments.map((item, index) => (
      <div
        key={index}
        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-all"
      >
        {/* Doctor Image */}
        <img
          className="rounded-full w-12 h-12 object-cover shadow-sm"
          src={item.docData.image}
          alt={item.docData.name}
        />

        {/* Booking Info */}
        <div className="flex-1 text-sm">
          <p className="text-gray-800 font-semibold">{item.docData.name}</p>
          <p className="text-gray-500">{slotDateFormat(item.slotDate)}</p>
        </div>

        {/* Status */}
        {item.cancelled ? (
          <p className="text-red-500 text-xs font-medium bg-red-100 py-1 px-3 rounded-full">
            Cancelled
          </p>
        ) : item.isCompleted ? (
          <p className="text-green-500 text-xs font-medium bg-green-100 py-1 px-3 rounded-full">
            Completed
          </p>
        ) : (
          <p className="text-blue-500 text-xs font-medium bg-blue-100 py-1 px-3 rounded-full">
            Booked
          </p>
        )}
      </div>
    ))}
  </div>
</div>


    </div>
  )
}

export default Dashboard