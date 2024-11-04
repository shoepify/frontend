// HomePage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FeaturedProductCard from '../components/FeaturedProductCard';
import CategoryLink from '../components/CategoryLink';
import '../styles/HomePage.css';
// Custom styles if needed

const HomePage = () => {
    const [cartItems] = useState([
        { id: 1, name: 'Running Shoe', price: 89.99, quantity: 1 },
        { id: 2, name: 'Casual Sneaker', price: 99.99, quantity: 2 }
    ]);

    const [favorites] = useState([
        { id: 1, name: 'High-Top Sneaker', price: 79.99 },
        { id: 2, name: 'Leather Boot', price: 129.99 }
    ]);

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
                    {featuredProducts.map(product => (
                        <div key={product.id} className="col-md-4 mb-3">
                            <FeaturedProductCard product={product} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section>
                <h2 className="text-center my-5">Shop by Category</h2>
                <div className="d-flex justify-content-around">
                    {categories.map(category => (
                        <CategoryLink key={category.label} category={category} />
                    ))}
                </div>
            </section>
        </div>
    );
};

// Featured products data
const featuredProducts = [
    { id: 1, name: 'Classic Running Shoe', price: 89.99, img: '/shoe1.jpg' },
    { id: 2, name: 'Stylish Casual Sneaker', price: 99.99, img: '/shoe2.jpg' },
    { id: 3, name: 'Sporty Training Shoe', price: 79.99, img: '/shoe3.jpg' }
];

// Categories data
const categories = [
    { label: 'Men', query: 'men', buttonClass: 'btn-outline-primary' },
    { label: 'Women', query: 'women', buttonClass: 'btn-outline-secondary' },
    { label: 'Kids', query: 'kids', buttonClass: 'btn-outline-success' }
];

export default HomePage;
