import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext()

//AppContextProvider component provides the doctors data to all its child components
const AppContextProvider = (props) => {

    const currencySymbol = '৳'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
  
    const [doctors, setDoctors] = useState([])
    // if token is present in local storage, save the token. as a result even after reloading the page user will be logged in
    const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)  
    const [userData, setUserData] = useState(false)


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


    const loadUserProfileData = async () => {
        try {
            
            const { data } = await axios.get(backendUrl + '/api/user/get-profile',{headers: {token}})
            if(data.success) {
                setUserData(data.userData)
                console.log(data.userData)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }


    // we can access these in any component
    const value = {
        doctors,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData
    }

    // whenever the page gets reload getDoctorsData function gets called & shows doctors list
    useEffect(()=>{
        getDoctorsData()
    },[])

    useEffect(()=>{
        if(token) {          // if token is present [user is logged in]
            loadUserProfileData()
        } else {
            setUserData(false)    // after logout, token is removed & userData is set to false
        }
    },[token])


    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider