// ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../supabase';  // Ajusta la ruta según la ubicación de tu archivo supabase.js

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verificar el token en el backend
          const response = await axios.post('http://localhost:3001/verifyToken', { token });
          setIsAuthenticated(response.data.isAuthenticated);
        }
      } catch (error) {
        console.error('Error al verificar token:', error);
      }
    };

    checkAuth();
  }, []);

  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Component /> : <Navigate to="/login" replace />}
    />
  );
};

export default ProtectedRoute;
