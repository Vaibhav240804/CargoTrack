import React, { useState } from "react";
import { useParams, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../api";

const Payment = () => {
  const { bookingId } = useParams(); 
  const [paymentStatus, setPaymentStatus] = useState("");

  const handlePayment = async () => {
    try {
      const response = await Api.makePayment(bookingId);
      if (response.status === 200) {
        setPaymentStatus("Payment Successful!");
        toast.success(response.data.message);
        redirect("/profile");
      }
      else{
        toast.error(response.data.message);
      }
    } catch (error) {
      setPaymentStatus("Payment Failed. Try again.");
      toast.error("Payment Failed. Try again.");
      console.error("Payment Error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Payment Page</h1>
      <p>Booking ID: {bookingId}</p>
      <button
        onClick={handlePayment}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Proceed to Payment
      </button>
      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
};

export default Payment;
