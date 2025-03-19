import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import HotelDetail from '../components/hotels/HotelDetail';

const HotelDetailPage = () => {
  return (
    <MainLayout>
      <div className="page-container">
        <HotelDetail />
      </div>
    </MainLayout>
  );
};

export default HotelDetailPage;
