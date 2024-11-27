import React from 'react';
import { List, Divider } from '@mui/material';
import CartItem from './CartItem';

const CartList = ({ cartProducts, onRemove, onQuantityChange }) => {
  return (
    <>
      <List sx={{ width: '50%', margin: '0 auto' }}>
        {cartProducts.map((product) => (
          <div key={product.id}>
            <CartItem
              product={product}
              onRemove={onRemove}
              onQuantityChange={onQuantityChange}
            />
            <Divider />
          </div>
        ))}
      </List>
    </>
  );
};

export default CartList;
