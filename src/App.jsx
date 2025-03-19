import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import BookingsPage from './pages/BookingsPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import StripeProvider from './components/providers/StripeProvider';
import './App.css';

function App() {
  return (
    <Router>
      <StripeProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/bookings" element={<BookingsPage />} />
          </Route>
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={
            <div className="not-found-page">
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
              <a href="/" className="btn">Go Home</a>
            </div>
          } />
        </Routes>
      </StripeProvider>
    </Router>
  );
}

export default App;