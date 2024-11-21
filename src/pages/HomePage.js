import React, { useEffect, useState, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/HomePage.css';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sliderRef = useRef(null);

    // Fetch products from the backend
    useEffect(() => {
        fetch('http://localhost:8000/products/')
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch products');
                return response.json();
            })
            .then((data) => {
                setProducts(data.slice(0, 10)); // Limit to 10 products
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleAddToCart = (productId) => {
        fetch('http://localhost:8000/cart/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to add to cart');
                alert('Added to cart!');
            })
            .catch((error) => alert(error.message));
    };

    const handleAddToFavorites = (productId) => {
        fetch('http://localhost:8000/favorites/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to add to favorites');
                alert('Added to favorites!');
            })
            .catch((error) => alert(error.message));
    };

    const handleMouseEnter = () => {
        // Stop animation when user interacts
        if (sliderRef.current) {
            sliderRef.current.style.animationPlayState = 'paused';
        }
    };

    const handleMouseLeave = () => {
        // Resume animation when user stops interacting
        if (sliderRef.current) {
            sliderRef.current.style.animationPlayState = 'running';
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <h1>Featured Products</h1>
            <div
                className="slider-container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="slider" ref={sliderRef}>
                    {products.map((product) => (
                        <div key={product.product_id} className="slider-item">
                            <ProductCard
                                product={product}
                                onAddToCart={handleAddToCart}
                                onAddToFavorites={handleAddToFavorites}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
