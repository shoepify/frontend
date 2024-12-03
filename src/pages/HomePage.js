import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/HomePage.css';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]); // ordered products
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all products from the backend
    useEffect(() => {
        fetch('http://localhost:8000/products/')
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch products');
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setSortedProducts(data); // Default unsorted state
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    // Sort products based on selected key
    const handleSort = (key) => {
        const sorted = [...products].sort((a, b) => {
            if (key === 'popularity_score') {
                return b.popularity_score - a.popularity_score || b.price - a.price; // Popularity descending, price descending if equal
            } else if (key === 'price') {
                return b.price - a.price || b.popularity_score - a.popularity_score; // Price descending, popularity descending if equal
            }
            return 0;
        });
        setSortedProducts(sorted);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <h1>Featured Products</h1>

            {/* Sort Buttons */}
            <div className="sort-buttons">
                <button onClick={() => handleSort('popularity_score')}>Sort by Popularity</button>
                <button onClick={() => handleSort('price')}>Sort by Price</button>
            </div>

            {/* Product Grid */}
            <div className="product-grid">
                {sortedProducts.map((product) => (
                    <div key={product.product_id} className="product-card">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
