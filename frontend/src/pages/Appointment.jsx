import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'
// import jwt from 'jsonwebtoken'


const Appointment = () => {

  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [isFollowing, setIsFollowing] = useState(false); 


  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  const getAvailableSlots = async () => {
    if (!docInfo || !docInfo.slots_booked) {
      return; 
    }
    
    setDocSlots([])

    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)     // current time is 10:00
        currentDate.setMinutes(0)    // sets the minutes to 0
      }

      let timeSlots = []

      // as long as endTime > currentDate, it'll generate time slots in 30 min interval
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDate()             
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()        

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime
 
        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        // only display the slots that are available, not all the slots
        if(isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }


        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }


  // API CALL: to book an appointment
  const bookAppointment = async (e) => {
      // user can't book an appointment without login 
      if(!token) {
        toast.warn('Login to book appointment')
        return navigate('/login')
      }

      try {

        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()             // getting day
        let month = date.getMonth() + 1      // getting month from january
        let year = date.getFullYear()        // getting year

        const slotDate = day + "_" + month + "_" + year    // creating date in dd_mm_yyyy format

        const {data} = await axios.post(backendUrl + '/api/user/book-appointment', {docId, slotDate, slotTime}, {headers: {token}})

        if(data.success) {
          toast.success(data.message)
          getDoctorsData()          //after booking, appointment data needs to be updated
          navigate('/my-appointments')        // after booking, redirect to my-appointments page
        } else {
          toast.error(data.message)
        }


      } catch (error) {
        console.log(error)
        toast.error(error.message);  
      }
  }

  //we've to run this function whenever page gets reloaded. when any of doctors or docId changes, this function will run
  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  // we'll show the appointment details only if the docInfo gets changed
  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])


  useEffect(() => {
    console.log(docSlots)
  }, [docSlots])


  useEffect(() => {
    if (token) {
      const followingStatus = localStorage.getItem(`isFollowing_${docId}`);
      if (followingStatus === "true") {
        setIsFollowing(true);
      }
    }
  }, [docId, token]);

  // const getUserIdFromToken = () => {
  //   if (token) {
  //     const decodedToken = jwt_decode(token) // Decode the JWT token
  //     return decodedToken.userId; // Return the userId from the decoded token
  //   }
  //   return null;
  // }

  const followDoctor = async () => {
    if (!token) {
      toast.warn('Login to follow a doctor');
      return navigate('/login');
    }
  
    try {

      // const userId = getUserIdFromToken();

      // console.log("userId:", userId);
      console.log("docId:", docId); 
      console.log({ token });  

      console.log(backendUrl + '/api/user/follow-doctor'); 
      const { data } = await axios.post(backendUrl + '/api/user/follow-doctor', { docId }, { headers: { token } });
  
      if (data.success) {
        toast.success('You are now following this doctor');
        setIsFollowing(true);
        localStorage.setItem(`isFollowing_${docId}`, 'true'); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  


  // we'll show the appointment details only if the docInfo is available
  return docInfo && (
    <div>
      {/* ----------------- Doctor Details ----------------- */}
      <div className='flex flex-col sm:flex-row gap-6 bg-gray-50 p-6 rounded-xl'>
      <div className='flex flex-col items-center w-full sm:w-auto'>
    <img className='w-full sm:max-w-72 rounded-xl shadow-md bg-primary' src={docInfo.image} alt="" />
    <button 
  onClick={followDoctor} 
  disabled={isFollowing} 
  className="bg-gray-100 border border-gray-200 shadow-md text-primary text-14 font-bold px-14 py-3 rounded-full mt-4 hover:bg-primary hover:text-white transition-colors duration-300"
>
  {isFollowing ? "Following" : "Follow Doctor"}
</button>

  </div>

  <div className='flex-1 border border-gray-200 rounded-xl p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 shadow-lg'>
    {/* ---------- Doc Info: name, degree, experience  ---------- */}
    <div className='flex items-center gap-3'>
      <p className='text-2xl font-semibold text-gray-800'>
        {docInfo.name}
      </p>
      {/* <img className='w-5' src={assets.verified_icon} alt="" /> */}
    </div>
    <div className='flex items-center gap-3 text-sm mt-2 text-gray-500'>
      <p>{docInfo.degree} - {docInfo.speciality}</p>
      <button className='py-1 px-3 bg-blue-100 text-blue-600 text-xs rounded-full font-medium'>
        {docInfo.experience}
      </button>
    </div>

    {/* ---------- Doctor About ---------- */}
    <div className='mt-5'>
      <p className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
        About
        {/* <img src={assets.info_icon} alt="" /> */}
      </p>
      <p className='text-sm text-gray-600 leading-relaxed mt-2 max-w-[700px]'>
        {docInfo.about}
      </p>
    </div>

    <p className='text-gray-600 font-medium mt-6'>
      Appointment fee: <span className='text-gray-800 font-semibold'>{currencySymbol}{docInfo.fees}</span>
    </p>
  </div>
</div>

      {/* <div className="flex justify-between items-center gap-4 my-6">
        <button onClick={followDoctor} disabled={isFollowing} className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">
          {isFollowing ? "Following" : "Follow Doctor"}

        </button>
      </div> */}


      {/* ------------ Booking Slots ----------- */}
      <div className='sm:ml-72 sm:pl-6 mt-6 font-medium text-gray-700 bg-gray-50 p-6 rounded-lg shadow-md'>
  <p className='text-lg text-gray-800'>Booking Slots</p>
  
  {/* ---------- Days Section ---------- */}
  <div className='flex gap-4 justify-center items-center w-full overflow-x-auto mt-6 scrollbar-hide'>
    {docSlots.length && docSlots.map((item, index) => (
      <div 
        onClick={() => setSlotIndex(index)} 
        className={`text-center py-4 px-5 min-w-[64px] rounded-lg cursor-pointer shadow-sm ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-300 bg-white'}`} 
        key={index}
      >
        <p className='text-sm font-medium'>
          {item[0] && daysOfWeek[item[0].datetime.getDay()]}
        </p>
        <p className='text-xl font-semibold'>
          {item[0] && item[0].datetime.getDate()}
        </p>
      </div>
    ))}
  </div>

  {/* ---------- Time Slots Section ---------- */}
  <div className='flex items-center gap-4 w-full overflow-x-auto mt-6 scrollbar-hide'>
    {docSlots.length && docSlots[slotIndex].map((item, index) => (
      <p 
        onClick={() => setSlotTime(item.time)} 
        className={`text-sm font-medium flex shrink-0 px-6 py-2 rounded-lg cursor-pointer shadow-sm ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-500 border border-gray-300 bg-white'}`} 
        key={index}
      >
        {item.time.toLowerCase()}
      </p>
    ))}
  </div>

  {/* ---------- Book Appointment Button ---------- */}
  <div className="flex justify-center mt-8">

  <button 
    onClick={bookAppointment} 
    className='bg-primary text-white text-sm font-medium px-16 py-3 rounded-full shadow-lg mt-8'>
    Book an Appointment
  </button>
  </div>
</div>



      {/* ------------- Listing Related Doctors ------------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointment