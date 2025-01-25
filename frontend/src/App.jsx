import React from 'react'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Payment from './pages/Payment'
import Login from './pages/Login'
import SearchResults from './pages/SearchResults'
import PaymentSuccess from './pages/PaymentSuccess'
import { Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_51QkilvP4HySZTQI2VMt8Y9AB5ObbeWR1uZ2TbbpwvCUKy18WsEZiGsSAGliEmiev6q62TaLtYaJ3GdE77z7Ly2rL00fgakNKAO');

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      {/* We've mounted this navbar to make it available in all pages*/}
      <ToastContainer/>
      <Navbar />
      <Elements stripe={stripePromise}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/payment/:appointmentId' element={<Payment />} />
        <Route path='/search-results' element={<SearchResults />} />
        <Route path='/payment-success' element={<PaymentSuccess />} />
      </Routes>
      </Elements>
      <Footer />
      
    </div>
  )
}

export default App 