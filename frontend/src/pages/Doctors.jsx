import React, { useContext,useEffect,useState } from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  
  const {speciality} = useParams()
  // console.log(speciality)
  
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const {doctors} = useContext(AppContext)
  const navigate = useNavigate()

  const applyFilter = () => {
    if(speciality){
      // if speciality of doctor is equal to the speciality passed, it will be filtered
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality)) 
    } else{
      setFilterDoc(doctors)     // else it will show all the doctors
    }
  } 

  // using applyfilter whenever doctors or speciality changes
  useEffect(() => {
    applyFilter()
  },[doctors, speciality])
  

  return (
    <div>
      <p className='text-gray-600 justify-center items-center'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        {/* if showFilter is true, it'll set it to false */}
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white': ''}`} onClick={()=>setShowFilter(prev => !prev)}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {/* if the speciality is already general(means already filter doctors) & we click again, we'll see all doctors. otherwise, if clicked in, filtered doctors*/}
          <p onClick={()=> speciality === 'General Physician' ? navigate('/doctors') : navigate('/doctors/General Physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General Physician" ? "bg-primary text-white" : " hover:bg-primary hover:text-white"}`}>General Physician</p>
          <p onClick={()=> speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-primary text-white" : "hover:bg-primary hover:text-white"}`}>Gynecologist</p>
          <p onClick={()=> speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-primary text-white" : "hover:bg-primary hover:text-white"}`}>Dermatologist</p>
          <p onClick={()=> speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-primary text-white" : "hover:bg-primary hover:text-white"}`}>Pediatricians</p>
          <p onClick={()=> speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-primary text-white" : "hover:bg-primary hover:text-white"}`}>Neurologist</p>
          <p onClick={()=> speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-primary text-white" : "hover:bg-primary hover:text-white"}`}>Gastroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'> 
        {      
          filterDoc.map((item, index)=>(
            <div onClick={() => navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-15px] transition-all duration-500' key={index}>
              <img className='bg-blue-50' src={item.image} alt="" /> 
                 <div className='p-4'>
                    <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'} `}>
                      <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
                    </div>
                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                    <p className='text-gray-600 text-sm'>{item.speciality}</p> 
                 </div>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  )
}

export default Doctors