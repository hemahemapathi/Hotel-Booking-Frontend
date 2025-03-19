import React, { useState, useEffect } from 'react';
import { getAllHotels } from '../../api/hotels';
import HotelCard from './HotelCard.jsx';
import SearchBar from '../searchbar/SearchBar.jsx';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getAllHotels();
        setHotels(data);
        setFilteredHotels(data);
      } catch (err) {
        setError('Failed to load hotels. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleSearch = (searchResults) => {
    setFilteredHotels(searchResults);
  };

  if (loading) {
    return <div className="loading">Loading hotels...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="hotel-list-container">
      <SearchBar onSearch={handleSearch} allHotels={hotels} />
      
      {filteredHotels.length === 0 ? (
        <div className="no-results">No hotels found matching your criteria.</div>
      ) : (
        <div className="hotel-grid">
          {filteredHotels.map(hotel => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelList;
