import React, { useState } from 'react';
import { searchHotels } from '../../api/hotels';

const SearchBar = ({ onSearch, allHotels }) => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceMin: '',
    priceMax: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty values
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, v]) => v !== '')
      );

      // If we have search parameters, call the API
      if (Object.keys(filteredParams).length > 0) {
        const results = await searchHotels(filteredParams);
        onSearch(results);
      } else {
        // If no search parameters, return all hotels
        onSearch(allHotels);
      }
    } catch (error) {
      console.error('Search error:', error);
      // In case of error, return all hotels
      onSearch(allHotels);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      priceMin: '',
      priceMax: ''
    });
    onSearch(allHotels);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-inputs">
          <div className="search-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="City, Country"
              value={searchParams.location}
              onChange={handleChange}
            />
          </div>
          
          <div className="search-group">
            <label htmlFor="checkIn">Check In</label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={searchParams.checkIn}
              onChange={handleChange}
            />
          </div>
          
          <div className="search-group">
            <label htmlFor="checkOut">Check Out</label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={searchParams.checkOut}
              onChange={handleChange}
            />
          </div>
          
          <div className="search-group">
            <label htmlFor="guests">Guests</label>
            <input
              type="number"
              id="guests"
              name="guests"
              min="1"
              value={searchParams.guests}
              onChange={handleChange}
            />
          </div>
          
          <div className="search-group">
            <label htmlFor="priceMin">Min Price</label>
            <input
              type="number"
              id="priceMin"
              name="priceMin"
              placeholder="$"
              min="0"
              value={searchParams.priceMin}
              onChange={handleChange}
            />
          </div>
          
          <div className="search-group">
            <label htmlFor="priceMax">Max Price</label>
            <input
              type="number"
              id="priceMax"
              name="priceMax"
              placeholder="$"
              min="0"
              value={searchParams.priceMax}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="search-buttons">
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button type="button" className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
