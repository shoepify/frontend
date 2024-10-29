// src/pages/CartPage.js

import React from 'react';

const CartPage = () => {
  // Example hardcoded cart data
  const cartItems = [
    { id: 1, name: 'Running Shoes', price: 100, quantity: 1 },
  ];

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        cartItems.map(item => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
      <button>Proceed to Checkout</button>
    </div>
  );
};

export default CartPage;
