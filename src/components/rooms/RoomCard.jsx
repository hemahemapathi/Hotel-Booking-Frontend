import React from 'react';

const RoomCard = ({ roomType, roomNumber, onSelect }) => {
  // Check if roomType object exists
  if (!roomType) {
    return <div className="room-card">Room data not available</div>;
  }

  // Safely access room properties with fallbacks based on your Room model
  const {
    _id,
    title = 'Standard Room',
    desc = 'No description available',
    price = 100,
    maxPeople = 2,
  } = roomType;

  // Default image
  const defaultImage = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWwlMjByb29tfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60';

  // Check if the room is available (no unavailable dates or empty array)
  const isAvailable = !roomNumber || 
    !roomNumber.unavailableDates || 
    roomNumber.unavailableDates.length === 0;

  // Create a combined object with both roomType and roomNumber info for the booking
  const roomData = {
    ...roomType,
    selectedRoomNumber: roomNumber ? roomNumber.number : null,
    selectedRoomId: roomNumber ? roomNumber._id : null
  };

  return (
    <div className={`room-card ${!isAvailable ? 'unavailable' : ''}`}>
      <div className="room-card-image">
        <img 
          src={defaultImage}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
      </div>
      <div className="room-card-content">
        <h3>{title}</h3>
        <p className="room-description">{desc}</p>
        
        <div className="room-details">
          <div className="room-capacity">
            <i className="fas fa-user"></i> Max Capacity: {maxPeople} {maxPeople === 1 ? 'Guest' : 'Guests'}
          </div>
          
          {roomNumber && (
            <div className="room-number">
              <span>Room Number: {roomNumber.number}</span>
              {!isAvailable && <span className="unavailable-badge">Currently Booked</span>}
            </div>
          )}
        </div>
        
        <div className="room-price">
          <span className="price">${price}</span> / night
        </div>
        
        <button 
          className="select-room-btn"
          onClick={() => onSelect(roomData)}
          disabled={!isAvailable}
        >
          {isAvailable ? 'Select Room' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;