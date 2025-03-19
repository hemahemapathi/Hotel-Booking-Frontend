import React from 'react';

const RoomDetail = ({ room, onBook, onClose }) => {
  if (!room) return null;

  return (
    <div className="room-detail-overlay">
      <div className="room-detail-container">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="room-detail-header">
          <h2>{room.name}</h2>
        </div>
        
        <div className="room-detail-images">
          {room.images && room.images.length > 0 ? (
            room.images.map((image, index) => (
              <div key={index} className="room-image">
                <img src={image} alt={`${room.name} - ${index + 1}`} />
              </div>
            ))
          ) : (
            <div className="room-image">
              <img 
                src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" 
                alt="No images available" 
              />
            </div>
          )}
        </div>
        
        <div className="room-detail-info">
          <div className="room-description">
            <h3>Description</h3>
            <p>{room.description || 'No description available'}</p>
          </div>
          
          <div className="room-specs">
            <div className="room-spec">
              <span className="spec-label">Capacity:</span>
              <span>{room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</span>
            </div>
            <div className="room-spec">
              <span className="spec-label">Size:</span>
              <span>{room.size || 'N/A'} sqft</span>
            </div>
            <div className="room-spec">
              <span className="spec-label">Bed Type:</span>
              <span>{room.bedType || 'Standard'}</span>
            </div>
          </div>
          
          <div className="room-amenities">
            <h3>Amenities</h3>
            {room.amenities && room.amenities.length > 0 ? (
              <ul>
                {room.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            ) : (
              <p>No amenities listed</p>
            )}
          </div>
        </div>
        
        <div className="room-detail-price">
          <div className="price-info">
            <span className="price">${room.price}</span>
            <span className="per-night">per night</span>
          </div>
          
          <button className="book-room-btn" onClick={() => onBook(room)}>
            Book This Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
