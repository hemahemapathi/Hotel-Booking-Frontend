import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import HotelList from '../components/hotels/HotelList';

const HotelsPage = () => {
  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1>Find Your Perfect Hotel</h1>
          <p>Browse our selection of hotels and find the perfect stay for your next trip</p>
        </div>
        <HotelList />
      </div>
    </MainLayout>
  );
};

export default HotelsPage;
