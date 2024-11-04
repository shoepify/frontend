// components/Product/FeaturedProductCard.js

import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedProductCard = ({ product }) => (
    <div className="card h-100 text-center shadow-sm">
        <img src={product.img} className="card-img-top uniform-image" alt={product.name} />
        <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
            <Link to={`/product/${product.id}`} className="btn btn-outline-primary">View Product</Link>
        </div>
    </div>
);

export default FeaturedProductCard;
