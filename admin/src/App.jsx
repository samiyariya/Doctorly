import React, {useContext} from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';

const App = () => {

  const {aToken} = useContext(AdminContext)

  // if token is present, show the admin dashboard, else show the login page
  return aToken ? (
    <div>
      <ToastContainer/>   {/* to show toast message */}
    </div>
  ) : (
    <>
      <Login/>  
      <ToastContainer/>
    </>

  )
}

export default App