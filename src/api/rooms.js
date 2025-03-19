import API_BASE_URL from './config';

// Get rooms for a specific hotel
export const getHotelRooms = async (hotelId) => {
  try {
    
    // The correct endpoint based on your backend structure
    const response = await fetch(`${API_BASE_URL}/hotels/find/${hotelId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch hotel: ${response.status}`);
    }
    
    // First get the hotel data
    const hotelData = await response.json();
    
    // Check if hotel has rooms
    if (!hotelData.rooms || hotelData.rooms.length === 0) {
      return [];
    }
    
    // Now fetch each room by ID
    const roomPromises = hotelData.rooms.map(roomId => 
      fetch(`${API_BASE_URL}/rooms/${roomId}`)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch room ${roomId}`);
          return res.json();
        })
        .catch(err => {
          console.error(`Error fetching room ${roomId}:`, err);
          return null;
        })
    );
    
    // Wait for all room requests to complete
    const roomsData = await Promise.all(roomPromises);
    
    // Filter out any null values (failed requests)
    const validRooms = roomsData.filter(room => room !== null);
    
    return validRooms;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
};

// Get a single room
export const getRoom = async (roomId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch room: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
};