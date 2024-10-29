import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    // Mock data for demonstration (Replace with actual data fetching in a real app)
    const [cartItems] = useState([
        { id: 1, name: 'Running Shoe', price: 89.99, quantity: 1 },
        { id: 2, name: 'Casual Sneaker', price: 99.99, quantity: 2 }
    ]);

    const [favorites] = useState([
        { id: 1, name: 'High-Top Sneaker', price: 79.99 },
        { id: 2, name: 'Leather Boot', price: 129.99 }
    ]);

    const featuredProducts = [
        { id: 1, name: 'Classic Running Shoe', price: 89.99, img: 'path/to/shoe1.jpg' },
        { id: 2, name: 'Stylish Casual Sneaker', price: 99.99, img: 'path/to/shoe2.jpg' },
        { id: 3, name: 'Sporty Training Shoe', price: 79.99, img: 'path/to/shoe3.jpg' }
    ];

    return (
        <div className="container my-5">
            {/* Banner Section */}
            <section className="text-center bg-light p-5 rounded mb-5">
                <h1>Welcome to Our Shoe Store</h1>
                <p>Discover the best shoes for every style and occasion!</p>
                <Link to="/products" className="btn btn-primary">Shop Now</Link>
            </section>

         
            {/* Featured Products Section */}
            <section>
                <h2 className="text-center my-5">Featured Products</h2>
                <div className="row">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="col-md-4 mb-3">
                            <div className="card h-100 text-center">
                                <img src={product.img} className="card-img-top" alt={product.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">${product.price.toFixed(2)}</p>
                                    <Link to={`/product/${product.id}`} className="btn btn-outline-primary">View Product</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section>
                <h2 className="text-center my-5">Shop by Category</h2>
                <div className="d-flex justify-content-around">
                    <Link to="/products?category=men" className="btn btn-outline-primary">Men</Link>
                    <Link to="/products?category=women" className="btn btn-outline-secondary">Women</Link>
                    <Link to="/products?category=kids" className="btn btn-outline-success">Kids</Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
