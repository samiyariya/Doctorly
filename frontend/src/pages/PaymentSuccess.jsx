import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/my-appointments");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 text-center">
      <img
        src={assets.paydone} // Replace with your image URL
        alt="Payment Successful"
        className="w-32 h-32 mb-6"
      />
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-green-600 mb-2">
        Thank you for completing your secure online payment.
      </p>
      <p className="text-lg text-green-600 mb-6">Have a great day!</p>
      <button
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg"
        onClick={handleNavigation}
      >
        View My Appointments
      </button>
    </div>
  );
};

export default PaymentSuccess;
