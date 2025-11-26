import React from "react";
import axios from "axios";

export default function PaymentButton({ amount = 500 }) {
  const handlePayment = async () => {
    try {
      // Create order on backend
      const { data: order } = await axios.post("http://localhost:5000/payment/create-order", {
        amount: amount * 100, // convert to paise
      });

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // frontend key from .env
        amount: order.amount,
        currency: order.currency,
        name: "Text2Flow",
        description: "Upgrade to Pro",
        order_id: order.id,
        handler: function (response) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          email: "user@example.com",
        },
        theme: {
          color: "#3b82f6",
        },
      };

      // Open Razorpay
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return <button onClick={handlePayment}>Upgrade / Buy</button>;
}
