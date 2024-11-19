import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../api";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await Api.makePayment(bookingId);

      if (response.status === 200) {
        setPaymentStatus("Payment Successful!");
        toast.success(response.data.message);
        navigate("/profile");
      } else {
        setPaymentStatus("Payment Failed.");
        toast.error(response.data.message);
      }
    } catch (error) {
      setPaymentStatus("Payment Failed. Try again.");
      toast.error(error.message);
      console.error("Payment Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", my: 8 }}>
      <Typography variant="h4" gutterBottom>
        Payment Page
      </Typography>
      <Typography variant="body1" gutterBottom>
        Booking ID: <strong>{bookingId}</strong>
      </Typography>
      <Box sx={{ mt: 4 }}>
        {!isProcessing ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            size="large"
            sx={{ px: 4, py: 1 }}
          >
            Proceed to Payment
          </Button>
        ) : (
          <CircularProgress />
        )}
      </Box>
      {paymentStatus && (
        <Typography
          variant="body1"
          sx={{
            mt: 3,
            color: paymentStatus.includes("Successful") ? "green" : "red",
          }}
        >
          {paymentStatus}
        </Typography>
      )}
    </Container>
  );
};

export default Payment;
