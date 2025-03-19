import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getBookings } from '../../utils/bookingUtils';
import BookingCard from './BookingCard';

const BookingList = () => {
  const [bookings, setBookings] = useState(getBookings());
  const [error, setError] = useState('');

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // Remove the booking from localStorage
        const updatedBookings = bookings.filter(booking => booking._id !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        setBookings(updatedBookings);
      } catch (err) {
        setError('Failed to cancel booking. Please try again.');
        console.error(err);
      }
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="no-bookings">
        <h2>You don't have any bookings yet.</h2>
        <p>Start exploring hotels and book your next stay!</p>
        <Link to="/hotels" className="btn">Browse Hotels</Link>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <h1>My Bookings</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="booking-list">
        {bookings.map(booking => (
          <BookingCard 
            key={booking._id}
            booking={booking}
            onCancel={() => handleCancelBooking(booking._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BookingList;