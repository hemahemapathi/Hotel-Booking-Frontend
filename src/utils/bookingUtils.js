// Format booking data for Stripe payment
export const formatBookingForPayment = (bookingData) => {
    return {
      token: bookingData.token,
      amount: Math.round(bookingData.totalPrice * 100), // Convert to cents
      email: bookingData.email || 'customer@example.com',
      bookingDetails: {
        hotelId: bookingData.hotelId,
        roomId: bookingData.roomId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guests: bookingData.guests,
        specialRequests: bookingData.specialRequests,
        totalPrice: bookingData.totalPrice
      }
    };
  };
  
  // Calculate number of nights between two dates
  export const calculateNights = (checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };
  
  // Format date for display
  export const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate a mock booking ID
  export const generateBookingId = () => {
    return 'booking_' + Math.random().toString(36).substr(2, 9);
  };

  // Store booking in localStorage
  export const storeBooking = (booking) => {
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(existingBookings));
  };

  // Get all bookings from localStorage
  export const getBookings = () => {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
  };