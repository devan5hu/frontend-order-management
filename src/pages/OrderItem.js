import React, { useEffect, useState } from 'react'; 
import { Box, Typography, Card, CardContent, Divider, Grid, Button, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom'; 
import api from '../services/api'; 
import Navbar from '../components/Navbar'; 
import WarningIcon from '@mui/icons-material/Warning'; 
import AddIcon from '@mui/icons-material/Add';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

const OrderDetail = () => {
  const { orderId } = useParams(); 
  const [order, setOrder] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]); 
  const [cart, setCart] = useState({}); 
  const [cancelled, setCancelled] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
      const fetchOrderDetail = async () => {
          try {
              const response = await api.get(`/api/orders/${orderId}`);
              setOrder(response.data);
              setUpdatedOrder(response.data)
          } catch (err) {
              setError('Failed to fetch order details. Please try again.');
          } finally {
              setLoading(false);
          }
      };
      fetchOrderDetail();
  }, [orderId]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const productDetails = [];
      
      for (let item of order?.orderItems || []) {
        try {
          const productResponse = await fetch(`https://fakestoreapi.com/products/${item.productId}`);
          const productData = await productResponse.json();
          productDetails.push({ ...productData, ...item });
        } catch (err) {
          console.error('Failed to fetch product details', err);
        }
      }
      
      setProducts(productDetails);
    };

    if (order?.orderItems) {
      fetchProductDetails();
    }
  }, [order]);

  function handleUpdateOrderRemove(product) {
    setUpdatedOrder(prevOrder => {
      const updatedOrderItems = prevOrder.orderItems.map(item => {
        if (item.productId === product.productId) {
          return { ...item, quantity: Math.max(1, item.quantity - 1) }; // Ensure quantity doesn't go below 1
        }
        return item;
      });
  
      // Calculate the new total amount
      const newTotalAmount = updatedOrderItems.reduce(
        (total, item) => total + ((item.quantity * item.price) + (0.1 * item.quantity * item.price) - (0.05 * item.quantity * item.price )),
        0
      );
  
      return {
        ...prevOrder,
        orderItems: updatedOrderItems,
        totalAmount: parseFloat(newTotalAmount.toFixed(2)), // Ensure precision
      };
    });
  }
  
  
  function handleUpdateOrderAdd(product) {
    setUpdatedOrder(prevOrder => {
      const updatedOrderItems = prevOrder.orderItems.map(item => {
        if (item.productId === product.productId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
  
      // Calculate the new total amount
      const newTotalAmount = updatedOrderItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );
  
      return {
        ...prevOrder,
        orderItems: updatedOrderItems,
        totalAmount: parseFloat(newTotalAmount.toFixed(2)), // Ensure precision
      };
    });
  }

  const updateOrder = async () => {
    if (JSON.stringify(order) !== JSON.stringify(updatedOrder)) {
      console.log("Orders are different");

      try {
        const payload = {
          orderItems: updatedOrder.orderItems,
          totalAmount: updatedOrder.totalAmount,
          timestamp: new Date().toISOString(),
        };

        const response = await api.put(`/api/orders/update/${orderId}`, payload);

        if (response.status === 200) {
          console.log("Order updated successfully", response.data);
          alert("Order Updated Successfully!");

          navigate('/orders');
        }
      } catch (err) {
        console.error("Error updating order", err);
        setError("Failed to update the order. Please try again.");
      }
    } else {
      console.log("Orders are the same! No update required.");
      alert("No changes detected. The order remains the same.");
    }
  };
  
  useEffect(() => {
    if (cancelled) {
      const cancelOrder = async () => {
        try {
          const response = await api.delete(`api/orders/cancel/${orderId}`);
          console.log(response.data);
          if (response.data.OrderStatus === "CANCELLED") {
            navigate('/orders');
          }
        } catch (err) {
          console.error('Error canceling order', err);
          setError('Failed to cancel the order. Please try again.');
        }
      };
  
      cancelOrder();
    }
  }, [cancelled, orderId, navigate]);
  
  const handleCancelOrder = () => {
    setCancelled(true);
  };

  return (
    <Box>
      <Navbar isLoggedIn={true} cartCount={Object.values(cart).reduce((total, count) => total + count, 0)} />
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom>
          Order #{orderId}
        </Typography>

        {loading && <Typography>Loading order details...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {order && (
          <Card sx={{ border: '1px solid #ddd', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                Order Status: {order.status}
                {(order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'Shipped' || order.status === 'Delivered' ) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#D32F2F', fontWeight: 'bold' }}>
                    <WarningIcon sx={{ fontSize: 20, marginRight: 1 }} />
                    <Typography variant="body2">
                      You cannot update the order once it has been shipped or delivered.
                    </Typography>
                  </Box>
                )}
              </Typography>

              <Typography variant="body2" color="textSecondary">
                Ordered on: {new Date(order.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body1" fontWeight="bold" mt={1}>
                Total: ${updatedOrder.totalAmount}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                (Inclusive of 10% tax and 5% discount)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start', 
                  marginTop: 3,
                  gap: 2, 
                }}
              >
                <Button
                  variant="contained"
                  disabled={order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'Shipped' || order.status === 'Delivered'}
                  sx={{
                    backgroundColor: order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'Shipped' || order.status === 'Delivered' ? '#ddd' : '#FF5722',
                    color: order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'Shipped' || order.status === 'Delivered' ? '#888' : '#fff',
                    '&:hover': {
                      backgroundColor: order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'Shipped' || order.status === 'Delivered' ? '#ddd' : '#orange',
                    },
                    width: '20%',
                    height: '50px',
                  }}
                  onClick={updateOrder}
                >
                  Confirm Update
                </Button>
                <Button
                  variant="outlined"
                  disabled={order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'Shipped' || order.status === 'Delivered'}
                  sx={{
                    backgroundColor: '#fff',
                    borderColor: order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'Shipped' || order.status === 'Delivered' ? '#ddd' : '#FF5722',
                    color: order.status === 'SHIPPED' || order.status === 'DELIVERED' ? '#888' : '#FF5722',
                    '&:hover': {
                      backgroundColor: order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'Shipped' || order.status === 'Delivered' ? '#fff' : '#FFE0B2',
                      borderColor: order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'Shipped' || order.status === 'Delivered' ? '#ddd' : '#FF5722',
                      color: '#FF5722',
                    },
                    width: '20%',
                    height: '50px',
                  }}
                  onClick={handleCancelOrder}
                >
                  Cancel
                </Button>
              </Box>

              <Divider sx={{ marginY: 2 }} />

              <Grid container spacing={2}>
                {products.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ border: '1px solid #ddd', boxShadow: 'none', padding: 2, marginBottom: 2 }}>
                      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                            <img 
                              src={product.image} 
                              alt={product.title.length > 15 ? `${product.title.substring(0, 15)}...` : product.title}
                              style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '200px' }} 
                            />
                          </Box>

                          <Typography variant="h6">{product.title.length > 15 ? `${product.title.substring(0, 15)}...` : product.title}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            Price: ${product.price}
                          </Typography>
                        </Box>

                        {(order.status === "SHIPPED" || order.status === "DELIVERED" || order.status == "Delivered" || order.status == "Shipped") ? null :
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop:'15px', paddingLeft: '25%' }}>
                            <Button variant="contained" sx = {{backgroundColor: '#000000', '&:hover': { backgroundColor: '#000000' }}} 
                                onClick={() => handleUpdateOrderRemove(product , product.quantity)} >
                              <RemoveRoundedIcon />
                            </Button>
                            <Typography variant="body2" color="textSecondary">
                              {updatedOrder.orderItems.find(item => item.productId === product.productId)?.quantity || 0}
                            </Typography>
                            <Button variant="contained" sx = {{backgroundColor: '#000000', '&:hover': { backgroundColor: '#000000' }}} 
                                onClick={() => handleUpdateOrderAdd(product , product.quantity)}>
                              <AddIcon />
                            </Button>
                          </Box>
                        }
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default OrderDetail;
