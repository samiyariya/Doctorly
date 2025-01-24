import React, { useState, useContext } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);
  const { appointmentId } = useParams();

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe.js is not loaded. Please try again later.");
      return;
    }

    setProcessing(true);

    try {
      // Create a payment intent on the backend
      const { data } = await axios.post(
        `${backendUrl}/create-payment-intent`,
        { amount: amount * 100 }, // Convert amount to cents
        { headers: { token } }
      );

      const clientSecret = data.clientSecret;

      // Confirm the payment on the client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            email,
            name,
            address: { country },
          },
        },
      });

      if (result.error) {
        // Handle error
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        // Payment succeeded
        toast.success("Payment Successful!");
        await axios.post(
          `${backendUrl}/api/user/update-payment-status`,
          { appointmentId },
          { headers: { token } }
        );

        navigate("/my-appointments");
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handlePayment}
        className="p-6 bg-white shadow-lg rounded-lg max-w-md w-full space-y-6"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Complete Your Payment
        </h2>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Card Information */}
        <div>
          <label className="block text-sm font-medium mb-2">Card Information</label>
          <div className="flex items-center p-3 border rounded bg-gray-50 mb-4">
            {/* Card Icons */}
            <div className="flex space-x-2 mr-3">
              <img
                src={assets.visa}
                alt="Visa"
                className="h-7"
              />
              <img
                src={assets.mastercard}
                alt="MasterCard"
                className="h-7"
              />
            </div>

            {/* Card Number Element */}
            <div className="flex-1">
              <CardNumberElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      fontFamily: "Arial, sans-serif",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: {
                      color: "#fa755a",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Expiry Date and CVC */}
          <div className="flex gap-4">
            {/* Expiry Date */}
            <div className="flex-1 p-3 border rounded bg-gray-50">
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      fontFamily: "Arial, sans-serif",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: {
                      color: "#fa755a",
                    },
                  },
                }}
              />
            </div>

            {/* CVC */}
            <div className="flex-1 p-3 border rounded bg-gray-50">
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      fontFamily: "Arial, sans-serif",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: {
                      color: "#fa755a",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Cardholder Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Country or Region */}
        <div>
          <label className="block text-sm font-medium mb-1">Country or Region</label>
          <select
            className="w-full p-2 border rounded"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="" disabled>
              Select your country
            </option>
            <option value="BN">Bangladesh</option>
            <option value="US">United States</option>
            <option value="IN">India</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Enter Amount</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Enter the amount to pay"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={processing || !stripe || !elements || !amount}
          className="w-full py-3 bg-green-600 text-sm font-medium text-white rounded hover:bg-green-500 transition-all"
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Payment;






// import React, { useState, useContext } from "react";
// import { useStripe, useElements, CardElement, PaymentElement } from "@stripe/react-stripe-js";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { AppContext } from '../context/AppContext'

// // 4242 4242 4242 4242

// const Payment = ( ) => {

//   const stripe = useStripe();
//   const elements = useElements();
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [country, setCountry] = useState("");
//   const [amount, setAmount] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const navigate = useNavigate();
//   const { backendUrl, token} = useContext(AppContext)
//   const { appointmentId } = useParams();

  
  
// const handlePayment = async (e) => { 
//     e.preventDefault(); 
//     if (!stripe || !elements) return; 

//     setProcessing(true); 

//     try { 
//         // Call backend to create payment intent 
//         const { data } = await axios.post(backendUrl + "/create-payment-intent", { amount: amount * 100 }); 
        
//         const clientSecret = data.clientSecret; 

//         // Confirm the payment
//         const result = await stripe.confirmCardPayment(clientSecret, { 
//             payment_method: { 
//                 card: elements.getElement(CardElement), 
//                 billing_details: { 
//                     email: email, 
//                     name: name, 
//                     address: { country: country }, 
//                 }, 
//             }, 
//         });

//         // Handle error case
//         if (result.error) { 
//             toast.error(result.error.message); 
//             return; // Exit function after showing error
//         }

//         // Handle success case
//         if (result.paymentIntent.status === "succeeded") {
//             toast.success("Payment Successful!"); 


//             const { data } = await axios.post(backendUrl + '/api/user/update-payment-status', {appointmentId}, {headers:{token}})   
//             console.log("sending appointment id:", appointmentId);
//             console.log(data);

//             if(data.success){
//                 console.log(data.message);
//                 console.log("testing");
//             }
            
//             navigate("/my-appointments"); 
//         }

//     } catch (err) { 
//         toast.error("Payment failed. Please try again."); 
//     } finally { 
//         setProcessing(false); 
//     }
// };



//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handlePayment}
//         className="p-6 bg-white shadow-lg rounded-lg max-w-md w-full space-y-6"
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-center">Complete Your Payment</h2>

//         {/* Email Field */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Email</label>
//           <input
//             type="email"
//             className="w-full p-2 border rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         {/* Card Information */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Card Information</label>
//           <div className="p-3 border rounded bg-gray-50">
//             <CardElement options={{ hidePostalCode: true }} />
//           </div>
//         </div>

//         {/* Cardholder Name */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Cardholder Name</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>

//         {/* Country or Region */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Country or Region</label>
//           <select
//             className="w-full p-2 border rounded"
//             value={country}
//             onChange={(e) => setCountry(e.target.value)}
//             required
//           >
//             <option value="" disabled>
//               Select your country
//             </option>
//             <option value="BN">Bangladesh</option>
//             <option value="US">United States</option>
//             <option value="IN">India</option>
//             <option value="CA">Canada</option>
//             <option value="GB">United Kingdom</option>
//             {/* Add more countries as needed */}
//           </select>
//         </div>

//         {/* Amount Input */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Enter Amount</label>
//           <input
//             type="number"
//             className="w-full p-2 border rounded"
//             placeholder="Enter the amount to pay"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             required
//             min="1"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={processing || !stripe || !elements || !amount}
//           className="w-full py-3 bg-green-600 text-sm font-medium text-white rounded hover:bg-green-500 transition-all"
//         >
//           {processing ? "Processing..." : "Pay Now"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Payment;
