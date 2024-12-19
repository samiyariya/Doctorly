import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext()

//AppContextProvider component provides the doctors data to all its child components
const AppContextProvider = (props) => {

    const currencySymbol = '৳'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])
    

    // we can access this currency symbol in any component
    const value = {
        doctors,
        currencySymbol
    }

    // API CALL: function to get all the doctors in the frontend
    const getDoctorsData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if(data.success) {
                setDoctors(data.doctors)    // setting details of doctors from the api call in setDoctors function
                console.log(data.doctors)
            } else {
                toast.error(data.message);      
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message);      
        }
    }


    // whenever the page gets reload getDoctorsData function gets called & shows doctors list
    useEffect(()=>{
        getDoctorsData()
    },[])

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider