import React from 'react';
import { ListItem, Box, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

const CartItem = ({ product, onRemove, onQuantityChange }) => {
  const totalPrice = (product.quantity * product.price).toFixed(2);

  return (
    <ListItem
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '16px 0',
        '&:hover': { backgroundColor: '#f0f0f0' },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: 150,
              height: 150,
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          />
        </Link>

        <Box>
          <Typography
            variant="h6"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '250px',
              fontSize: '18px', 
              fontWeight: 'bold',
            }}
          >
            <Link
              to={`/product/${product.id}`}
              style={{
                textDecoration: 'none',
                color: 'black',
                cursor: 'pointer',
              }}
            >
              {product.title}
            </Link>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <IconButton
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(product.id);
          }}
          sx={{ padding: 0 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18" 
            height="18" 
            fill="currentColor"
            className="bi bi-trash"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 0a.5.5 0 0 1 .5.5V1h5V.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h1V.5a.5.5 0 0 1 .5-.5h3zM3 2v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2H3z" />
          </svg>
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange(product.id, -1);
            }}
            sx={{
              padding: 1, 
              backgroundColor: '#f0f0f0',
              fontSize: '20px',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-dash-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0V6a.5.5 0 0 0-.5-.5z" />
              <path d="M16 8a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" />
            </svg>
          </IconButton>
          <Typography variant="body2" sx={{ fontSize: '16px' }}>
            {product.quantity}
          </Typography>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange(product.id, 1);
            }}
            sx={{
              padding: 1, 
              backgroundColor: '#f0f0f0',
              fontSize: '20px', 
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0V6a.5.5 0 0 0-.5-.5z" />
              <path d="M16 8a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" />
            </svg>
          </IconButton>
        </Box>

        {/* Total Price */}
        <Typography variant="body2" sx={{ fontSize: '16px' }}>
          Total: ${totalPrice}
        </Typography>
      </Box>
    </ListItem>
  );
};

export default CartItem;
