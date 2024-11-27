import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import CartList from '../components/Cart/CartList';
import { fetchCartProducts } from '../services/CartService';
import Navbar from '../components/Navbar';
import api from '../services/api';
import AuthService from '../utils/authService';

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [cartCount, setCartCount] = useState(0); 

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart'));

    if (storedCart) {
      const fetchProducts = async () => {
        try {
          const products = await fetchCartProducts(storedCart);
          setCartProducts(products);
        } catch (error) {
          console.error('Failed to fetch cart products', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setCartCount(cartProducts.reduce((total, product) => total + product.quantity, 0));
  }, [cartProducts]);

  const handleRemoveFromCart = (productId) => {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart) {
      delete storedCart[productId];
      localStorage.setItem('cart', JSON.stringify(storedCart));
      setCartProducts(cartProducts.filter((product) => product.id !== productId));
    }
  };

  const handleChangeQuantity = (productId, change) => {
    const updatedCart = [...cartProducts];
    const productIndex = updatedCart.findIndex((product) => product.id === productId);
    if (productIndex >= 0) {
      updatedCart[productIndex].quantity += change;
      if (updatedCart[productIndex].quantity <= 0) {
        updatedCart[productIndex].quantity = 1;
      }
      setCartProducts(updatedCart);
      const storedCart = JSON.parse(localStorage.getItem('cart'));
      storedCart[productId] = updatedCart[productIndex].quantity;
      localStorage.setItem('cart', JSON.stringify(storedCart));
    }
  };

  const calculateTotal = () => {
    const subtotal = cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
    const tax = subtotal * 0.1;
    const discount = subtotal * 0.05;
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  };

  const { subtotal, tax, discount, total } = calculateTotal();

  const handlePlaceOrder = async () => {
    const orderItems = cartProducts.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      price: product.price,
    }));

    const payload = {
      timestamp: new Date().toISOString(),
      totalAmount: total,
      orderItems: orderItems,
    };

    try {
      const { data } = await api.post('/api/orders/place', payload, {
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (data && data.status === 'ORDER_PLACED') {
        localStorage.removeItem('cart');
        setCart({});
        setCartProducts([]);
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
      } else {
        alert('Failed to place order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order.');
    }
  };

  return (
    <>
      <Navbar
        isLoggedIn={true}
        cartCount={cartCount}
      />
      <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 4 }}>
        <Box sx={{ width: '70%' }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
            Your Cart
          </Typography>

          {loading ? (
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              Loading your cart...
            </Typography>
          ) : cartProducts.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              Your cart is empty.
            </Typography>
          ) : (
            <CartList
              cartProducts={cartProducts}
              onRemove={handleRemoveFromCart}
              onQuantityChange={handleChangeQuantity}
            />
          )}
        </Box>

        <Box
          sx={{
            width: '28%',
            position: 'sticky',
            top: 20,
            p: 3,
            boxShadow: 2,
            borderRadius: 2,
            backgroundColor: '#f9f9f9',
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Order Summary
          </Typography>
          <Typography variant="body1">Subtotal: ${subtotal.toFixed(2)}</Typography>
          <Typography variant="body1">Tax (10%): ${tax.toFixed(2)}</Typography>
          <Typography variant="body1">Discount (5%): -${discount.toFixed(2)}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ${total.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Cart;
