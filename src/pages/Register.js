// src/pages/Register.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container } from '@mui/material';
import AuthService from '../utils/authService';  
import FormInput from '../components/FormInput';   
import api from '../services/api';
import Navbar from '../components/Navbar';

const Register = () => {
  const navigate = useNavigate();

  // Check if user is already authenticated, redirect to /products if logged in
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/products');
    }
  }, [navigate]);

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: ''
  });

  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  // Password validation
  if (formData.password.length < 6 || formData.password.length > 19) {
    setError('Password must be between 6 and 19 characters.');
    setLoading(false);
    return;
  }

  try {
    // Make API request for registration
    const response = await api.post('/api/register', formData);
    const { token, status, message } = response.data;

    if (status === 'SUCCESS') {
      localStorage.setItem('token', token);
      navigate('/products'); // Redirect to /products after successful registration
    } else {
      setError(message);
    }
  } catch (err) {
    setError(err.response?.data?.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};


  return (
    <>
    <Navbar />
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>Register to be a Member!</Typography>
        {error && <Typography variant="body1" color="error">{error}</Typography>}
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <FormInput
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormInput
            label="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
          <FormInput
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ 
              backgroundColor: '#000000',
              '&:hover': { backgroundColor: '#000000' },
              height:'50px',
              marginTop:2
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2">
            Already have an account? 
            <Button onClick={() => navigate('/login')} color="secondary">
              Login here
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  </>
  );
};

export default Register;
