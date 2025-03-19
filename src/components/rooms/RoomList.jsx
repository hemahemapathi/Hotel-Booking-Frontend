import React, { useState, useEffect } from 'react';
import { getHotelRooms } from '../../api/rooms';
import RoomCard from './RoomCard';

const RoomList = ({ hotelId, onRoomSelect }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getHotelRooms(hotelId);
        
        // Ensure we have valid room data
        if (Array.isArray(data) && data.length > 0) {
          // Transform data to match Room schema from server
          const transformedData = data.map(room => ({
            _id: room._id,
            title: room.title,
            price: room.price,
            maxPeople: room.maxPeople,
            desc: room.desc,
            roomNumbers: room.roomNumbers || [],
            createdAt: room.createdAt,
            updatedAt: room.updatedAt
          }));
          setRoomTypes(transformedData);
        } else {
          setRoomTypes([]);
        }
      } catch (err) {
        setError('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      setLoading(true);
      fetchRooms();
    } else {
      setError('No hotel ID provided');
      setLoading(false);
    }
  }, [hotelId]);

  if (loading) {
    return <div className="loading">Loading available rooms...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (roomTypes.length === 0) {
    return <div className="no-rooms">No rooms available for this hotel.</div>;
  }

  // Create an array of individual room cards
  const allRooms = [];

  roomTypes.forEach(roomType => {
    // If there are no room numbers, create at least one card for the room type
    if (!roomType.roomNumbers || roomType.roomNumbers.length === 0) {
      allRooms.push(
        <RoomCard 
          key={`${roomType._id}-default`}
          roomType={{
            ...roomType,
            title: roomType.title,
            price: roomType.price,
            maxPeople: roomType.maxPeople,
            desc: roomType.desc
          }}
          roomNumber={null}
          onSelect={onRoomSelect}
        />
      );
    } else {
      // Create a card for each room number with unavailable dates
      roomType.roomNumbers.forEach(roomNumber => {
        allRooms.push(
          <RoomCard 
            key={`${roomType._id}-${roomNumber.number}`}
            roomType={{
              ...roomType,
              title: roomType.title,
              price: roomType.price,
              maxPeople: roomType.maxPeople,
              desc: roomType.desc
            }}
            roomNumber={{
              number: roomNumber.number,
              unavailableDates: roomNumber.unavailableDates || []
            }}
            onSelect={onRoomSelect}
          />
        );
      });
    }
  });

  return (
    <div className="room-list">
      <div className="room-grid">
        {allRooms}
      </div>
    </div>
  );
};

export default RoomList;