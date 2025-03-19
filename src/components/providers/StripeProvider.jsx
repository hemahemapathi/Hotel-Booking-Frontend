import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51PofX4JMju3UYc4uRnZy8xjiyOanOzPZS12jDBiuOKc4WZkx9hyHs9cuRyRQH1LhAVepJDhpEAxJiVzzhWGgfshl00TIyLb4pE');

const StripeProvider = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;