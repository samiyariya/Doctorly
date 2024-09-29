import React, { useState } from 'react'
import {assets} from '../assets/assets.js'
import { NavLink, useNavigate} from 'react-router-dom'

const Navbar = () => {

    // react router hook to navigate to different pages
    const navigate = useNavigate();

    // creating state variables
    const [showMenu, setShowMenu] = useState(false);
    const [token, setToken] = useState(true);  {/*token will be true if user is logged in*/}

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img className='w-44 cursor-pointer' src={assets.logo} alt=''/>
        {/* hidden -> in phone view ul tag will be hidden, md -> in medium deivce ul tag will be visible */}
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>   {/*after clicking on home link, home page will be shown*/}
                <li className='py-1'>HOME</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>    {/*hidding horizontal line */}
            </NavLink>
            <NavLink to='/doctors'>
                <li className='py-1'>ALL DOCTORS</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>          
            </NavLink>
            <NavLink to='/about'>
                <li className='py-1'>ABOUT</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>          
            </NavLink>
            <NavLink to='/contact'>
                <li className='py-1'>CONTACT</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>          
            </NavLink>
        </ul>  
        <div className='flex items-center gap-4'>   {/*button will be hidden in phone view, visible in medium & large devices */}
            {
                token   // if token is true then user is logged in & hide button
                ? <div>   {/*profile pic will be shown as user is logged in*/}
                    <img className='w-8 rounded-full' src={assets.profile_pic} alt=''/>
                    <img className='w-2.5' src={assets.dropdown_icon} alt=''/>
                </div> 
                // token false, show button, onClick will navigate to login page
                : <button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
            }
        </div> 
    </div>
  )
} 

export default Navbar