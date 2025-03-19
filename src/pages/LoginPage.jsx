import React from 'react';
import MainLayout from '../components/layout/MainLayout.jsx';
import Login from '../components/auth/Login.jsx';

const LoginPage = () => {
  return (
    <MainLayout>
      <div className="page-container">
        <Login />
      </div>
    </MainLayout>
  );
};

export default LoginPage;
