// PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isLoggedIn, isAllowed }) => {
  return isLoggedIn ? ( isAllowed ? ( <Outlet />) : <Navigate to="/" /> ) : <Navigate to="/" />
};

export default PrivateRoute;
