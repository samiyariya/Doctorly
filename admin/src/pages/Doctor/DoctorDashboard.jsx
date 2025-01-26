import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

    const {dToken, dashData, setDashData, getDashData,completeAppointment, cancelAppointment}  = useContext(DoctorContext)
    const {currency, slotDateFormat}  = useContext(AppContext)

    useEffect(()=>{
        if(dToken){
            getDashData()
        }
    },[dToken])


  return dashData && (
    <div className='m-5'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Earnings",
            value: `${currency} ${dashData.earnings}`,
            icon: assets.earning_icon,
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

      

      <div className="bg-white rounded-lg shadow-md py-8">
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
        {/* User Image */}
        <img
          className="rounded-full w-12 h-12 object-cover shadow-sm"
          src={item.userData.image}
          alt={item.userData.name}
        />

        {/* Booking Info */}
        <div className="flex-1 text-sm">
          <p className="text-gray-800 font-semibold">{item.userData.name}</p>
          <p className="text-gray-500">{slotDateFormat(item.slotDate)}</p>
        </div>

        {/* Status or Actions */}
        {item.cancelled ? (
          <p className="text-red-500 text-xs font-medium bg-red-100 py-1 px-3 rounded-full">
            Cancelled
          </p>
        ) : item.isCompleted ? (
          <p className="text-green-500 text-xs font-medium bg-green-100 py-1 px-3 rounded-full">
            Completed
          </p>
        ) : (
          <div className="flex gap-3">
            {/* Uncomment if cancel functionality is needed */}
            {/* <img
              onClick={() => cancelAppointment(item._id)}
              className="w-8 cursor-pointer hover:scale-105 transition-transform"
              src={assets.cancel_icon}
              alt="Cancel Icon"
            /> */}
            <img
              onClick={() => completeAppointment(item._id)}
              className="w-8 cursor-pointer hover:scale-105 transition-transform"
              src={assets.tick_icon}
              alt="Complete Icon"
            />
          </div>
        )}
      </div>
    ))}
  </div>
</div>


        
    </div>
  )
}

export default DoctorDashboard