import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  // React Router hook to navigate to different pages
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    // navigate("/search-results", { state: { query: searchQuery } }); 
    navigate(`/search-results?query=${searchQuery}`);  

    setSearchQuery(""); 
};

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt=""
      />

      {/* Navigation Menu */}
      <div className="flex items-center gap-4 md:flex-1">
        <ul className="hidden md:flex items-start gap-4 font-medium justify-between ml-28">
          <NavLink to="/">
            <li className="py-1">HOME</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/doctors">
            <li className="py-1">DOCTORS</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/suggest-specialist">
            <li className="py-1">CONSULTATION</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/about">
            <li className="py-1">ABOUT</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/contact">
            <li className="py-1">CONTACT</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
        </ul>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for doctors..."
            className="border border-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm w-70 ml-20 focus:outline-none focus:ring-1 focus:ring-gray-300 pr-7" 
          />

          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 pr-2"
            type="submit">
            <img src={assets.search} alt="Search" className="w-6 h-6" />
          </button>
        </form>
      </div>

      {/* Right-side Menu for Logged In Users */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* Mobile Menu */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">HOME</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

// import React, { useContext, useState } from 'react'
// import {assets} from '../assets/assets.js'
// import { NavLink, useNavigate} from 'react-router-dom'
// import { AppContext } from '../context/AppContext.jsx';

// const Navbar = () => {

//     // react router hook to navigate to different pages
//     const navigate = useNavigate();
//     const {token, setToken,userData} = useContext(AppContext)
//     const [showMenu, setShowMenu] = useState(false);

//     const logout = () => {
//         setToken(false);
//         localStorage.removeItem('token');
//     }

//   return (
//     <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
//         <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt=''/>
//         {/* hidden -> in phone view ul tag will be hidden, md -> in medium deivce ul tag will be visible */}
//         <ul className='hidden md:flex items-start gap-5 font-medium'>
//             <NavLink to='/'>   {/*after clicking on home link, home page will be shown*/}
//                 <li className='py-1'>HOME</li>
//                 <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>    {/*hidding horizontal line */}
//             </NavLink>
//             <NavLink to='/doctors'>
//                 <li className='py-1'>ALL DOCTORS</li>
//                 <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
//             </NavLink>
//             <NavLink to='/about'>
//                 <li className='py-1'>ABOUT</li>
//                 <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
//             </NavLink>
//             <NavLink to='/contact'>
//                 <li className='py-1'>CONTACT</li>
//                 <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
//             </NavLink>
//         </ul>
//         <div className='flex items-center gap-4'>   {/*button will be hidden in phone view, visible in medium & large devices */}
//             {
//                 token && userData   // if token & userData is true then user is logged in & hide button
//                 // group class is used on the parent div, when parent div is hovered over, the child element can respond making it visible
//                 ? <div className='flex items-center gap-2 cursor-pointer group relative'>   {/*profile pic will be shown as user is logged in*/}
//                     <img className='w-8 rounded-full' src={userData.image} alt=''/>
//                     <img className='w-2.5' src={assets.dropdown_icon} alt=''/>
//                     {/* This div is hidden by default but becomes visible we hover over image (which has the group class)*/}
//                     <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
//                         <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
//                             <p onClick={()=>navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
//                             <p onClick={()=>navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
//                             {/* after clicking on logout, token will be false &login button will be visible */}
//                             <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
//                         </div>
//                     </div>
//                 </div>

//                 // token false, show button, onClick will navigate to login page
//                 : <button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
//             }
//             <img onClick={()=> setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt=''/>
//             {/* ----------------- Mobile Menu ------------------ */}
//             <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
//                 <div className='flex items-center justify-between px-5 py-6'>
//                     <img className='w-36' src={assets.logo} alt="" />
//                     <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
//                 </div>
//                 <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
//                     <NavLink onClick={()=>setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
//                     <NavLink onClick={()=>setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
//                     <NavLink onClick={()=>setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
//                     <NavLink onClick={()=>setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
//                 </ul>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Navbar
