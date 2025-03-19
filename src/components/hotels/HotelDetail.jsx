import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById } from '../../api/hotels';
import { isAuthenticated } from '../../utils/authUtils';
import RoomList from '../rooms/RoomList';
import BookingForm from '../bookings/BookingForm';
import { generateBookingId, storeBooking } from '../../utils/bookingUtils';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const data = await getHotelById(id);
        setHotel(data);
      } catch (err) {
        setError(`Failed to load hotel details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotelDetails();
    } else {
      setError('No hotel ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleRoomSelect = (room) => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/hotels/${id}` } });
      return;
    }
    
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {

      // Check if payment was successful
      if (bookingData.paymentResult && bookingData.paymentResult.success) {
        // Store the booking in localStorage for persistence
        const newBooking = {
          _id: bookingData.paymentResult.bookingId || generateBookingId(),
          userId: 'current_user', // In a real app, get this from auth context
          hotel: {
            _id: hotel._id,
            name: hotel.name,
            location: hotel.location || hotel.city || hotel.address
          },
          room: {
            _id: selectedRoom._id,
            roomNumber: selectedRoom.selectedRoomNumber,
            roomType: selectedRoom.title || selectedRoom.name
          },
          checkIn: bookingData.checkInDate,
          checkOut: bookingData.checkOutDate,
          guests: bookingData.guests,
          specialRequests: bookingData.specialRequests,
          totalPrice: bookingData.totalPrice,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        };

        // Store booking in localStorage
        storeBooking(newBooking);

        // Update UI
        setPaymentSuccess(true);
        setBookingId(newBooking._id);

        // Redirect to bookings page after a delay
        setTimeout(() => {
          navigate('/bookings');
        }, 3000);
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(`Booking failed: ${err.message}`);
    }
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setPaymentSuccess(false);
    setError('');
  };

  if (loading) {
    return <div className="loading">Loading hotel details...</div>;
  }

  if (!hotel) {
    return (
      <div className="not-found">
        <h2>Hotel Not Found</h2>
        <p>The hotel you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/hotels')} className="btn">
          Back to Hotels
        </button>
      </div>
    );
  }

  return (
    <div className="hotel-detail-container">
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <div className="hotel-detail-header">
        <h1>{hotel.name}</h1>
        <div className="hotel-location">
          <i className="fas fa-map-marker-alt"></i> {hotel.location || hotel.city || hotel.address}
        </div>
        <div className="hotel-rating">
          {Array(Math.floor(hotel.rating || 0)).fill().map((_, i) => (
            <span key={i} className="star">★</span>
          ))}
          <span className="rating-text">({hotel.rating || 0})</span>
        </div>
      </div>
      
      <div className="hotel-images">
        {hotel.photos && hotel.photos.length > 0 ? (
          hotel.photos.map((image, index) => (
            <div key={index} className="hotel-image">
              <img src={image} alt={`${hotel.name} - ${index + 1}`} />
            </div>
          ))
        ) : (
          <div className="hotel-image">
            <img 
              src="https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI="
              alt="No images available" 
            />
          </div>
        )}
      </div>
      
      <div className="hotel-info">
        <div className="hotel-description">
          <h2>Description</h2>
          <p>{hotel.description || hotel.desc || 'No description available'}</p>
        </div>
        
        <div className="hotel-amenities">
          <h2>Amenities</h2>
          {hotel.amenities && hotel.amenities.length > 0 ? (
            <ul>
              {hotel.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          ) : (
            <p>No amenities listed</p>
          )}
        </div>
      </div>
      
      {/* Rooms section */}
      <div className="rooms-section">
        <h2 className="rooms-section-title">Available Rooms at {hotel.name}</h2>
        <RoomList 
          hotelId={id}
          onRoomSelect={handleRoomSelect}
        />
      </div>
      
      {showBookingForm && selectedRoom && (
        <div className="booking-form-overlay">
          <div className="booking-form-container">
            <button 
              className="close-form-btn"
              onClick={handleCloseBookingForm}
            >
              ×
            </button>
            
            {paymentSuccess ? (
              <div className="payment-success">
                <div className="success-icon">✓</div>
                <h2>Payment Successful!</h2>
                <p>Your booking has been confirmed.</p>
                {bookingId && <p>Booking ID: {bookingId}</p>}
                <p>You will be redirected to your bookings page shortly...</p>
              </div>
            ) : (
              <>
                <div className="selected-room-info">
                  <h3>Selected Room: {selectedRoom.title || selectedRoom.name}</h3>
                  <p>${selectedRoom.price} per night</p>
                </div>
                <BookingForm 
                  hotel={hotel}
                  room={selectedRoom}
                  onSubmit={handleBookingSubmit}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetail;