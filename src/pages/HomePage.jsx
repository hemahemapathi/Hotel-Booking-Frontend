import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { getAllHotels } from '../api/hotels';
import HotelCard from '../components/hotels/HotelCard';

const HomePage = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        const hotels = await getAllHotels();
        // Get up to 4 hotels to feature
        setFeaturedHotels(hotels.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, []);

  return (
    <MainLayout>
      <div className="home-container">
        <div className="hero-section">
          <h1>Find Your Perfect Stay</h1>
          <p>Discover and book hotels at the best prices</p>
          <div className="cta-buttons">
            <Link to="/hotels" className="cta-button">Browse Hotels</Link>
            <Link to="/about" className="cta-button secondary">Learn More</Link>
          </div>
        </div>
        
        <div className="featured-hotels">
          <h2>Featured Hotels</h2>
          {loading ? (
            <p className="loading">Loading featured hotels...</p>
          ) : (
            <div className="hotel-grid">
              {featuredHotels.map(hotel => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}
          {!loading && featuredHotels.length > 0 && (
            <div className="view-all-container">
              <Link to="/hotels" className="view-all-btn">View All Hotels</Link>
            </div>
          )}
        </div>
        
        <div className="features-section">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Best Prices</h3>
              <p>We offer the best prices for hotels around the world. Our price match guarantee ensures you always get the best deal.</p>
            </div>
            <div className="feature-card">
              <h3>Wide Selection</h3>
              <p>Choose from thousands of hotels worldwide, from luxury resorts to cozy boutique hotels and budget-friendly options.</p>
            </div>
            <div className="feature-card">
              <h3>Easy Booking</h3>
              <p>Our simple booking process makes it easy to find and book your perfect stay in just a few clicks.</p>
            </div>
            <div className="feature-card">
              <h3>24/7 Support</h3>
              <p>Our customer support team is available 24/7 to assist you with any questions or issues you may have.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;