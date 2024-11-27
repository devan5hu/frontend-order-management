// src/pages/Login.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container } from '@mui/material';
import AuthService from '../utils/authService';  
import FormInput from '../components/FormInput';   
import api from '../services/api';
import Navbar from '../components/Navbar';

const Login = () => {
  const navigate = useNavigate();

  // Redirect to /products if already logged in
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/products');
    }
  }, [navigate]);

  const [formData, setFormData] = React.useState({
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

    try {
      // Make API request for login
      const response = await api.post('/api/login', formData);
      const { token, status, message } = response.data;

      if (status === 'SUCCESS') {
        localStorage.setItem('token', token);
        navigate('/products');  // Redirect to /products after successful login
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
        <Typography variant="h4" gutterBottom>Login to use MyShop effectively!</Typography>
        {error && <Typography variant="body1" color="error">{error}</Typography>}
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: '#000000',
              '&:hover': { backgroundColor: '#000000' },
              marginTop:2,
              height:'50px'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2">
            Don't have an account? 
            <Button onClick={() => navigate('/register')} color="secondary">
              Register here
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
    </>
  );
};

export default Login;
