import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom'; 
import AuthService from '../utils/authService'; 

const Navbar = ({ isLoggedIn, cartCount }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const categories = ['Sale' , 'Men', 'Women', 'Kids', 'Winter Specials', 'Discount Specials'];

  const handleLogout = () => {
    AuthService.logout(); 
    window.location.reload(); 
  };

  // Check if the current route is login or register
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <AppBar position="static" sx={{ backgroundColor: '#000000', padding: 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Typography
          variant="h4"
          component="div"
          sx={{ flex: '0 0 auto', cursor: 'pointer', textAlign: 'left', color: 'white' }}
          onClick={() => navigate('/products')}
        >
          MyShop
        </Typography>

        {/* Categories in the center */}
        <Box sx={{ display: 'flex', flex: '1', justifyContent: 'center', gap: 3 }}>
          {categories.map((category, index) => (
            <Button
              key={index}
              sx={{
                color: 'white',
                fontSize: '14px',
                textTransform: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => navigate(`/category/${category.toLowerCase().replace(/ /g, '-')}`)}
            >
              {category}
            </Button>
          ))}
        </Box>

        {/* Icons on the right */}
        <Box sx={{ display: 'flex', gap: 1, flex: '0 0 auto', alignItems: 'center' }}>
          {!AuthService.isAuthenticated() ? (
            // Conditionally show Login or Register button based on the current page
            isLoginPage ? (
              <Button
                sx={{
                  color: 'white',
                  fontSize: '14px',
                  textTransform: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  paddingRight: '10px',
                  width: '150px',
                }}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            ) : isRegisterPage ? (
              <Button
                sx={{
                  color: 'white',
                  fontSize: '14px',
                  textTransform: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  paddingRight: '10px',
                  width: '150px',
                }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            ) : (
              <Button
                sx={{
                  color: 'white',
                  fontSize: '14px',
                  textTransform: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  paddingRight: '10px',
                  width: '150px',
                }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )
          ) : (
            <>
              {/* Cart Icon */}
              <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/cart')}>
                <Badge
                  badgeContent={cartCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#FF0000',
                      color: 'white',
                    },
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </Badge>
              </Box>

              {/* My Orders */}
              <Button
                sx={{
                  color: 'white',
                  fontSize: '14px',
                  textTransform: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  width: '85px'
                }}
                onClick={() => navigate('/orders')}
              >
                My Orders
              </Button>

              {/* Logout Button */}
              <Button
                sx={{
                  color: 'white',
                  fontSize: '14px',
                  textTransform: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  width: '30px'
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
