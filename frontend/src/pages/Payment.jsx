import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Call backend to create payment intent
      const { data } = await axios.post("http://localhost:4000/create-payment-intent", {
        amount: amount * 100, // Convert amount to cents
      });

      const clientSecret = data.clientSecret;

      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: email,
            name: name,
            address: {
              country: country,
            },
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment Successful!");
        navigate("/my-appointments"); // Redirect after success
      }
    } catch (err) {
      toast.error("Payment failed. Please try again.");
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
        <h2 className="text-2xl font-semibold mb-4 text-center">Complete Your Payment</h2>

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
          <label className="block text-sm font-medium mb-1">Card Information</label>
          <div className="p-3 border rounded bg-gray-50">
            <CardElement options={{ hidePostalCode: true }} />
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
            {/* Add more countries as needed */}
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
