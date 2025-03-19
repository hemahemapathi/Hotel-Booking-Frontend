import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51QrJeyHC7M2dVX5yjMpw3mcUmKUnAc0EP6LgQPvrp1SgfXxkpjKDmHBTUteBjdORjqQO3kDzN08wyPrgPig5vKZK001KQxaTji');

export default stripePromise;
