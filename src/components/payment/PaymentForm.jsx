import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API_BASE_URL from '../../api/config';
import { getToken } from '../../utils/authUtils';
import { formatBookingForPayment } from '../../utils/bookingUtils';

const PaymentForm = ({ booking, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create a token
      const cardElement = elements.getElement(CardElement);
      const { error, token } = await stripe.createToken(cardElement);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Process payment with your backend
      const response = await fetch(`${API_BASE_URL}/bookings/selected`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          token,
          amount: booking.totalPrice,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Payment failed');
      }
      
      // Payment successful
      onSuccess({
        success: true,
        message: data.message,
        bookingId: 'booking_' + Math.random().toString(36).substr(2, 9) // Mock booking ID
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment processing failed');
      onError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h3>Payment Details</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Card Information</label>
          <div className="card-element-container">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
        
        <div className="payment-summary">
          <div className="summary-item total">
            <span>Total Amount:</span>
            <span>${booking.totalPrice}</span>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="pay-now-btn" 
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : `Pay ${booking.totalPrice}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;