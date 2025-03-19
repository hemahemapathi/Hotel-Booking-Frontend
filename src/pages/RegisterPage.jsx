import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Register from '../components/auth/Register';

const RegisterPage = () => {
  return (
    <MainLayout>
      <div className="page-container">
        <Register />
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
