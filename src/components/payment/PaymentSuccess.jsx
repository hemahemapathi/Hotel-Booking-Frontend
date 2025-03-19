import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = ({ bookingId }) => {
  return (
    <div className="payment-success">
      <div className="success-icon">✓</div>
      <h2>Payment Successful!</h2>
      <p>Your booking has been confirmed.</p>
      {bookingId && <p>Booking ID: {bookingId}</p>}
      <p>Thank you for choosing our service.</p>
      <div className="success-actions">
        <Link to="/bookings" className="view-bookings-btn">
          View My Bookings
        </Link>
        <Link to="/" className="home-btn">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
