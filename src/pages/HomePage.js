// src/HomePage.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeaturedProductCard from '../components/FeaturedProductCard'; // Adjust the path as needed
import '../styles/HomePage.css';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        // Fetch products from the backend
        fetch('http://localhost:8000/products/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                return response.json();
            })
            .then((data) => {
                // Store only the first three products
                setProducts(data.slice(0, 3));
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container my-5">
            {/* Banner Section */}
            <section className="banner-section text-center p-5 rounded shadow mb-5">
                <h1 className="display-4">Welcome to Our Shoe Store</h1>
                <p className="lead">Discover the best shoes for every style and occasion!</p>
                <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
            </section>

            {/* Featured Products Section */}
            <section>
                <h2 className="text-center my-5">Featured Products</h2>
                <div className="row">
                    {products.map((product) => (
                        <div key={product.product_id} className="col-md-4 mb-3">
                            <FeaturedProductCard product={product} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
