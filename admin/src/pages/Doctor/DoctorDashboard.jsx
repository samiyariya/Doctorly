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

      

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold text-gray-500'>Latest Booking</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {
            dashData.latestAppointments.map((item,index)=>(
             <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item.userData.image} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
                </div>
                {
                item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>cancelled</p>
                :item.isCompleted
                  ?<p className='text-green-500 text-xs font-medium'>completed</p>
                  : <div className='flex'>
                     {/* <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" /> */}
                     <img onClick={()=>completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
                 }
             </div>
            ))
          }
        </div>

      </div>



        
    </div>
  )
}

export default DoctorDashboard