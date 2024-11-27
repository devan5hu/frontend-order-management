import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div>
      <Navbar />
      <Container>
        {product && (
          <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth: 600, mx: 'auto' }}>
            <CardMedia
              component="img"
              height="400"
              image={product.image}
              alt={product.title}
              sx={{ objectFit: 'contain' }}
            />
            <CardContent>
              <Typography variant="h5" component="div">{product.title}</Typography>
              <Typography variant="body1" color="text.secondary">${product.price}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{product.description}</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 3 }}>
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default ProductDetail;
