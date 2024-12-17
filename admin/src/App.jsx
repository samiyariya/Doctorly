import React, {useContext} from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AddDoctor from './pages/Admin/AddDoctor';
import AllAppointments from './pages/Admin/AllAppointments';
import DoctorsList from './pages/Admin/DoctorsList';

const App = () => {

  const {aToken} = useContext(AdminContext)

  // if token is present, show the admin dashboard, else show the login page
  return aToken ? (
    <div className='bg-[#00B395]'>
      <ToastContainer/>   
      <Navbar/>

      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/all-appointments' element={<AllAppointments/>} />
          <Route path='/add-doctor' element={<AddDoctor/>} />
          <Route path='/doctor-list' element={<DoctorsList/>} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login/>  
      <ToastContainer/>
    </>

  )
}

export default App