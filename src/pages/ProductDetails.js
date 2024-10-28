// src/pages/ProductDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';

const products = [
  { id: 1, name: 'Running Shoes', price: 100, description: 'Great for running!' },
  { id: 2, name: 'Basketball Shoes', price: 120, description: 'High-top basketball shoes.' },
  { id: 3, name: 'Casual Shoes', price: 80, description: 'Perfect for casual wear.' },
];

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const product = products.find(p => p.id === parseInt(id)); // Find product by ID

  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-details">
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductDetails;
