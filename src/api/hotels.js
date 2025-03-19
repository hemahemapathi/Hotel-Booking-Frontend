import API_BASE_URL from './config';
import { getToken } from '../utils/authUtils';

// Get all hotels
export const getAllHotels = async (filters = {}) => {
  try {
    // Convert filters object to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const response = await fetch(`${API_BASE_URL}/hotels?${queryParams.toString()}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch hotels');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Get hotel by ID
export const getHotelById = async (hotelId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/hotels/find/${hotelId}`);
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch hotel details: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching hotel:', error);
    throw error;
  }
};

// Get hotel rooms
export const getHotelRooms = async (hotelId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}/rooms`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch hotel rooms');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Search hotels with availability
export const searchHotels = async (searchParams) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const response = await fetch(`${API_BASE_URL}/hotels/search?${queryParams.toString()}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to search hotels');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};