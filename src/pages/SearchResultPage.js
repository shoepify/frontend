import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/SearchResultPage.css';

const SearchResultPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extract the search query from the URL
    const query = new URLSearchParams(useLocation().search).get('q');

    useEffect(() => {
        if (query) {
            fetch(`http://localhost:8000/products/search/?q=${query}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch search results');
                    }
                    return response.json();
                })
                .then((data) => {
                    setProducts(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error fetching search results:', err);
                    setError(err);
                    setLoading(false);
                });
        }
    }, [query]);

    const handleAddToCart = (productId) => {
        console.log(`Product ${productId} added to cart`);
        // Implement cart addition logic here
    };

    const handleAddToFavorites = (productId) => {
        console.log(`Product ${productId} added to favorites`);
        // Implement favorites addition logic here
    };

    if (loading) return <div>Loading search results...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="search-results-page">
            <h1>Search Results</h1>
            {products.length > 0 ? (
                <div className="product-grid">
                    {products.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                            onAddToCart={handleAddToCart}
                            onAddToFavorites={handleAddToFavorites}
                        />
                    ))}
                </div>
            ) : (
                <p>No products found for "{query}"</p>
            )}
        </div>
    );
};

export default SearchResultPage;
