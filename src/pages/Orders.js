import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import api from '../services/api'; // Your API file
import Navbar from '../components/Navbar'; // Ensure Navbar is imported

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState({}); // State to track cart items
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Fetch orders from the API
    const fetchOrders = async () => {
      try {
        const response = await api.get('/api/orders/my-orders');
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleGetUpdate = async (orderId) => {
    try {
      const response = await api.get(`/api/orders/status/${orderId}`);
      const updatedStatus = response.data.OrderStatus;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: updatedStatus } : order
        )
      );
      alert(`Order status updated to: ${updatedStatus}`);
    } catch (error) {
      console.error('Error fetching order status:', error);
      alert('Failed to fetch order status.');
    }
  };

  // Handle navigating to the order details page
  const handleViewOrder = (orderId) => {
    if (orderId) {
        navigate(`/orders/${orderId}`); // Navigate with the order ID
      } else {
        console.error('Order ID is undefined');
      }
  };

  return (
    <Box>
      {/* Navbar */}
      <Navbar isLoggedIn={true} cartCount={Object.values(cart).reduce((total, count) => total + count, 0)} />

      {/* Main Content */}
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom>
          My Orders
        </Typography>

        {loading && <Typography>Loading your orders...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && orders.length === 0 && (
          <Typography>No orders found. Start shopping!</Typography>
        )}

        {!loading && !error && orders.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {orders.slice(0).reverse().map((order) => (
              <Card key={order.orderId} sx={{ border: '1px solid #ddd', boxShadow: 'none' }}>
                <CardContent>
                  <Typography variant="h6">
                    Order #{order.orderId} - {order.status}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Ordered on: {new Date(order.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" mt={1}>
                    Total: ${order.totalAmount}
                  </Typography>

                  <Divider sx={{ marginY: 2 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {order.orderItems.map((item) => (
                      <Box
                        key={item.orderItemId}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 1,
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          backgroundColor: '#fff',
                        }}
                      >
                        <Typography>Product #{item.productId}</Typography>
                        <Typography>Quantity: {item.quantity}</Typography>
                        <Typography>Price: ${item.price}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ marginY: 2 }} />

                  {/* Get Update Button */}
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#FF5722',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#E64A19' },
                    }}
                    onClick={() => handleGetUpdate(order.orderId)}
                  >
                    Get Update
                  </Button>

                  {/* View/Update Order Button */}
                  <Button
                    variant="outlined"
                    sx={{
                      marginLeft: 2,
                      borderColor: '#FF5722',
                      color: '#FF5722',
                      '&:hover': { borderColor: '#E64A19', color: '#E64A19' },
                    }}
                    onClick={() => handleViewOrder(order.orderId)}
                  >
                    View/Update Order
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyOrders;
