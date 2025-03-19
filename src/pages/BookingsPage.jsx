import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import BookingList from '../components/bookings/BookingList';
import { isAuthenticated } from '../utils/authUtils';

const BookingsPage = () => {
  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>View and manage your hotel reservations</p>
        </div>
        <BookingList />
      </div>
    </MainLayout>
  );
};

export default BookingsPage;