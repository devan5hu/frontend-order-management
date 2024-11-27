// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../utils/authService';

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  // If the user is authenticated, render the protected element, else redirect to login
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
