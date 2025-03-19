import React from 'react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  // Check if hotel object exists
  if (!hotel) {
    return <div className="hotel-card">Hotel data not available</div>;
  }

  // Safely access hotel properties with fallbacks
  const {
    _id,
    name = 'Unknown Hotel',
    rating = 0,
    price = 0,
    photos = [],
    city = 'City not specified',
    type = 'Type not specified',
    address = 'Address not specified',
    cheapestPrice = 0,
    distance = 0
  } = hotel;

  // Default image if none provided
  const defaultImage = 'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=';
  const imageUrl = photos && photos.length > 0 ? photos[0] : defaultImage;

  return (
    <div className="hotel-card">
      <div className="hotel-card-image">
        <img 
          src={imageUrl}
          alt={name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
      </div>
      <div className="hotel-card-content">
        <h3>{name}</h3>
        <div className="hotel-details">
          <p>City: {city}</p>
          <p>Type: {type}</p>
          <p>Address: {address}</p>
          <p>Distance: {distance}km from center</p>
        </div>
        <div className="hotel-rating">
          {Array(Math.floor(rating || 0)).fill().map((_, i) => (
            <span key={i} className="star">★</span>
          ))}
          <span className="rating-text">({rating || 0})</span>
        </div>
        <div className="hotel-price">
          <span className="price">${cheapestPrice || price}</span> / night
        </div>
        <Link to={`/hotels/${_id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HotelCard;