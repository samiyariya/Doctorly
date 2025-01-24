import axios from "axios"
import { createContext, useState } from "react"
import { toast } from "react-toastify"
export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [doctors,setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // API CALL: function to get all the doctors in the admin panel
    const getAllDoctors = async() => {

        try {

            // destructuring the data from the response, sending nothing to the backend
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors',{},{headers: {aToken}})
            if(data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message);  
        }
    }


    //  API CALL: function to change availability of a doctor
    const changeAvailability = async(docId) => {

        try {
        
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                // if the availability gets changed, update all the doctors availability state also
                getAllDoctors()    
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);              
        }
    }

    const getAllAppointments = async () => {

        try {
    
            const {data} = await axios.get(backendUrl+'/api/admin/appointments', {headers:{aToken}})

            if (data.success){
                setAppointments(data.appointments)
                console.log(data.appointments)
                
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async(appointmentId) => {
        try {

            const {data} = await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId}, {headers: {aToken}})
            
            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // we can access these from any component
    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        getAllDoctors, changeAvailability, 
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider