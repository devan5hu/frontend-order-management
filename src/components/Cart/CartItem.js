import React from 'react';
import { ListItem, Box, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';


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
        <DeleteIcon/>
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
          <RemoveRoundedIcon />
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
            <AddIcon />
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
