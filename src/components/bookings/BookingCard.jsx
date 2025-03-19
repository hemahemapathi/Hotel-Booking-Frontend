import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/bookingUtils';

const BookingCard = ({ booking, onCancel }) => {
  // Check if booking is upcoming (check-in date is in the future)
  const isUpcoming = new Date(booking.checkIn) > new Date();
  
  // Check if booking is active (current date is between check-in and check-out)
  const isActive = new Date() >= new Date(booking.checkIn) && 
                   new Date() <= new Date(booking.checkOut);
  
  // Check if booking is past (check-out date is in the past)
  const isPast = new Date(booking.checkOut) < new Date();

  // Determine booking status
  const getBookingStatus = () => {
    if (isActive) return 'active';
    if (isUpcoming) return 'upcoming';
    if (isPast) return 'completed';
    return '';
  };

  return (
    <div className={`booking-card ${getBookingStatus()}`}>
      <div className="booking-hotel-info">
        <h3>{booking.hotel.name}</h3>
        <p className="booking-location">{booking.hotel.location}</p>
      </div>
      
      <div className="booking-details">
        <div className="booking-room">
          <span className="label">Room:</span>
          <span>{booking.room.roomType}</span>
        </div>
        
        <div className="booking-room-number">
          <span className="label">Room Number:</span>
          <span>{booking.room.roomNumber}</span>
        </div>
        
        <div className="booking-dates">
          <div className="check-in">
            <span className="label">Check-in:</span>
            <span className="date">{formatDate(booking.checkIn)}</span>
          </div>
          <div className="check-out">
            <span className="label">Check-out:</span>
            <span className="date">{formatDate(booking.checkOut)}</span>
          </div>
        </div>
        
        <div className="booking-guests">
          <span className="label">Guests:</span>
          <span>{booking.guests}</span>
        </div>
        
        {booking.specialRequests && (
          <div className="booking-special-requests">
            <span className="label">Special Requests:</span>
            <p>{booking.specialRequests}</p>
          </div>
        )}
        
        <div className="booking-price">
          <span className="label">Total Price:</span>
          <span className="price">${booking.totalPrice}</span>
        </div>
        
        <div className="booking-status">
          <span className={`status-badge ${getBookingStatus()}`}>{getBookingStatus()}</span>
        </div>
      </div>
      
      <div className="booking-actions">
        <Link to={`/hotels/${booking.hotel._id}`} className="view-hotel-btn">
          View Hotel
        </Link>
        
        {isUpcoming && (
          <button onClick={onCancel} className="cancel-booking-btn">
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;