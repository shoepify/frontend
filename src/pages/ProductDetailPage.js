// pages/ProductDetailPage.js

import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
    const { id } = useParams();

    // Retrieve product details based on `id`
    // (for demonstration, this is hard-coded; in a real app, fetch this data from an API or context)
    const product = {
        id,
        name: 'Sample Product Name',
        price: 89.99,
        description: 'This is a sample product description.',
        img: '/shoe1.jpg'
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={product.img} alt={product.name} className="img-fluid" />
                </div>
                <div className="col-md-6">
                    <h1>{product.name}</h1>
                    <p className="lead">${product.price.toFixed(2)}</p>
                    <p>{product.description}</p>
                    <button className="btn btn-primary">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
