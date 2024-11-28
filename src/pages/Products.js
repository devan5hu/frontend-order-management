import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CustomSlider from '../components/CustomSlider';
import AddIcon from '@mui/icons-material/Add';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AuthService from '../utils/authService';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({}); // State to track cart items

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart)); // Store the cart in localStorage
    }
  }, [cart]); // This hook runs only when cart state changes

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: (prevCart[product.id] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[product.id] > 1) {
        updatedCart[product.id] -= 1;
      } else {
        delete updatedCart[product.id];
      }
      return updatedCart;
    });
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <button type="button" className="slick-prev">Prev</button>,
    nextArrow: <button type="button" className="slick-next">Next</button>,
  };

  return (
    <div>
      <Navbar
        isLoggedIn={true}
        cartCount={Object.values(cart).reduce((total, count) => total + count, 0)}
      />
      <Box sx={{ my: 3, maxHeight: '600px', overflow: 'hidden', height: '750px' }}>
        <Slider {...carouselSettings}>
          <div>
            <CustomSlider
              image="https://preview.colorlib.com/theme/shopmax/images/model_3.png.webp"
              text="Explore Our Collection"
              buttonText="Shop Now"
              buttonLink="/products"
            />
          </div>
          <div>
            <CustomSlider
              image="https://preview.colorlib.com/theme/shopmax/images/model_4.png.webp"
              text="Discover New Trends"
              buttonText="Browse More"
              buttonLink="/products"
            />
          </div>
          <div>
            <CustomSlider
              image="https://preview.colorlib.com/theme/shopmax/images/model_4.png.webp"
              text="Exclusive Offers"
              buttonText="Get Started"
              buttonLink="/offers"
            />
          </div>
        </Slider>
      </Box>

      <Container>
        <Typography variant="h4" sx={{ my: 4 }}>
          Our Products
        </Typography>
        <Grid container spacing={3}>
          {loading ? (
            <Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
              Loading...
            </Typography>
          ) : (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.title}
                    sx={{
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease', // Smooth zoom transition
                      '&:hover': {
                        transform: 'scale(1.1)', // Zoom effect
                      },
                    }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" component="div">
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${product.price}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
                    {cart[product.id] ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button variant="contained" sx = {{backgroundColor: '#000000', '&:hover': { backgroundColor: '#000000' }}} 
                            onClick={!AuthService.isAuthenticated() ? () => navigate('/login') : () => handleRemoveFromCart(product)}>
                          <RemoveRoundedIcon />
                        </Button>
                        <Typography>{cart[product.id]}</Typography>
                        <Button variant="contained" sx = {{backgroundColor: '#000000', '&:hover': { backgroundColor: '#000000' }}} 
                            onClick={!AuthService.isAuthenticated() ? () => navigate('/login') : () => handleAddToCart(product)}>
                          <AddIcon />
                        </Button>
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#000000',
                          '&:hover': { backgroundColor: '#000000' },
                        }}
                        onClick={!AuthService.isAuthenticated() ? () => navigate('/login') : () => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </div>
  );
};

export default Products;
