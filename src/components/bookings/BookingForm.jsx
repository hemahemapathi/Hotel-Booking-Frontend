import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../checkout/CheckOutForm.jsx';
import { formatDate, calculateNights } from '../../utils/bookingUtils';

// Replace with your publishable key
const stripePromise = loadStripe('pk_test_51QrJeyHC7M2dVX5yjMpw3mcUmKUnAc0EP6LgQPvrp1SgfXxkpjKDmHBTUteBjdORjqQO3kDzN08wyPrgPig5vKZK001KQxaTji');

const BookingForm = ({ hotel, room, onSubmit }) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    checkInDate: today,
    checkOutDate: tomorrow,
    guests: 1,
    specialRequests: ''
  });
  
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Booking details, 2: Payment
  const [bookingDetails, setBookingDetails] = useState(null);
  
  const calculateTotalPrice = () => {
    if (!room) return 0;
    
    const nights = calculateNights(formData.checkInDate, formData.checkOutDate);
    return nights > 0 ? nights * room.price : 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Check if check-in date is valid
    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    } else if (new Date(formData.checkInDate) < new Date(today)) {
      newErrors.checkInDate = 'Check-in date cannot be in the past';
    }
    
    // Check if check-out date is valid
    if (!formData.checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    } else if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      newErrors.checkOutDate = 'Check-out date must be after check-in date';
    }
    
    // Check if guests number is valid
    if (!formData.guests || formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    } else if (room && room.maxPeople && formData.guests > room.maxPeople) {
      newErrors.guests = `This room can only accommodate up to ${room.maxPeople} guests`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create booking details object
      const bookingData = {
        ...formData,
        hotelId: hotel._id,
        hotelName: hotel.name,
        roomId: room._id,
        roomName: room.title || room.name,
        roomNumber: room.selectedRoomNumber,
        totalPrice: calculateTotalPrice()
      };
      
      setBookingDetails(bookingData);
      setStep(2); // Move to payment step
    }
  };
  
  const handlePaymentSuccess = (paymentResult) => {
    // Call the parent component's onSubmit with booking details and payment result
    onSubmit({
      ...bookingDetails,
      paymentResult
    });
  };
  
  const handlePaymentError = (errorMessage) => {
    setErrors({
      payment: errorMessage
    });
  };
  
  if (!room) {
    return <div className="error-message">Please select a room first</div>;
  }
  
  return (
    <div className="booking-form">
      <h2>{step === 1 ? 'Book Your Stay' : 'Complete Your Payment'}</h2>
      
      {step === 1 ? (
        // Step 1: Booking Details Form
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="checkInDate">Check-in Date</label>
            <input
              type="date"
              id="checkInDate"
              name="checkInDate"
              min={today}
              value={formData.checkInDate}
              onChange={handleChange}
            />
            {errors.checkInDate && <div className="error">{errors.checkInDate}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="checkOutDate">Check-out Date</label>
            <input
              type="date"
              id="checkOutDate"
              name="checkOutDate"
              min={formData.checkInDate || tomorrow}
              value={formData.checkOutDate}
              onChange={handleChange}
            />
            {errors.checkOutDate && <div className="error">{errors.checkOutDate}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="guests">Number of Guests</label>
            <input
              type="number"
              id="guests"
              name="guests"
              min="1"
              max={room.maxPeople}
              value={formData.guests}
              onChange={handleChange}
            />
            {errors.guests && <div className="error">{errors.guests}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests (optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              rows="3"
              value={formData.specialRequests}
              onChange={handleChange}
            />
          </div>
          
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-item">
              <span>Hotel:</span>
              <span>{hotel.name}</span>
            </div>
            <div className="summary-item">
              <span>Room:</span>
              <span>{room.title || room.name}</span>
            </div>
            <div className="summary-item">
              <span>Room Number:</span>
              <span>{room.selectedRoomNumber || 'Not specified'}</span>
            </div>
            <div className="summary-item">
              <span>Check-in:</span>
              <span>{formatDate(formData.checkInDate)}</span>
            </div>
            <div className="summary-item">
              <span>Check-out:</span>
              <span>{formatDate(formData.checkOutDate)}</span>
            </div>
            <div className="summary-item">
              <span>Guests:</span>
              <span>{formData.guests}</span>
            </div>
            <div className="summary-item total">
              <span>Total Price:</span>
              <span>${calculateTotalPrice()}</span>
            </div>
          </div>
          
          <button type="submit" className="submit-booking-btn">
            Proceed to Payment
          </button>
        </form>
      ) : (
        // Step 2: Payment Form with Stripe
        <div>
          <div className="booking-summary payment-summary">
            <h3>Booking Details</h3>
            <div className="summary-item">
              <span>Hotel:</span>
              <span>{hotel.name}</span>
            </div>
            <div className="summary-item">
              <span>Room:</span>
              <span>{room.title || room.name}</span>
            </div>
            <div className="summary-item">
              <span>Dates:</span>
              <span>{formatDate(formData.checkInDate)} to {formatDate(formData.checkOutDate)}</span>
            </div>
            <div className="summary-item total">
              <span>Total Amount:</span>
              <span>${calculateTotalPrice()}</span>
            </div>
          </div>
          
          {errors.payment && <div className="error-message">{errors.payment}</div>}
          
          <Elements stripe={stripePromise}>
            <CheckoutForm
              booking={{...bookingDetails, totalPrice: calculateTotalPrice()}}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
          
          <button
            type="button"
            className="back-btn"
            onClick={() => setStep(1)}
          >
            Back to Booking Details
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingForm;