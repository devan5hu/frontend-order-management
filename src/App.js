// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import PrivateRoute from './components/PrivateRoute';
import AuthService from './utils/authService';
import Cart from './pages/Cart'
import MyOrders from './pages/Orders';
import OrderItem from './pages/OrderItem';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={AuthService.isAuthenticated() ? <Navigate to="/products" /> : <Register />}
        />
        <Route
          path="/login"
          element={AuthService.isAuthenticated() ? <Navigate to="/products" /> : <Login />}
        />
        <Route path="/cart" element={
          <PrivateRoute element={< Cart />}/>
        }/>
        <Route path="/orders" element={
          <PrivateRoute element={< MyOrders />}/>
        }/>
        <Route path="/orders/:orderId" element={<PrivateRoute element={<OrderItem />} />} />
        <Route
          path="/products"
          element={<Products />}
        />
        <Route path="/product/:id" element={<PrivateRoute element={<ProductDetail />} />} />
        <Route
          path="/"
          element={<Navigate to="/products" />}
        />
      </Routes>

    </Router>
  );
};

export default App;
