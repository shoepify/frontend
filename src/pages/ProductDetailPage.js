// src/pages/ProductDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
    const { productId } = useParams();
    // Fetch product details using productId

    return (
        <div>
            <h1>Product Name</h1>
            <p>Description of the product</p>
            <p>Price: $100</p>
            <button>Add to Cart</button>
        </div>
    );
};

export default ProductDetailPage;
