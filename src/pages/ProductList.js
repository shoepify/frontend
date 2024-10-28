// src/pages/ProductList.js
import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  { id: 1, name: 'Running Shoes', price: 100 },
  { id: 2, name: 'Basketball Shoes', price: 120 },
  { id: 3, name: 'Casual Shoes', price: 80 },
];

const ProductList = () => {
  return (
    <div className="product-list">
      <h2>Shop Our Collection</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <Link to={`/products/${product.id}`}>View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
