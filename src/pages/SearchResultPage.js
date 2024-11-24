import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/SearchResultPage.css';

const SearchResultPage = () => {
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]); // State for sorted products
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
                    setSortedProducts(data); // Default sorted products are the same as fetched products
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error fetching search results:', err);
                    setError(err);
                    setLoading(false);
                });
        }
    }, [query]);

    const handleSort = (key) => {
        const sorted = [...products].sort((a, b) => {
            if (key === 'popularity_score') {
                return b.popularity_score - a.popularity_score || b.price - a.price; // Sort by popularity descending, price as tiebreaker
            } else if (key === 'price') {
                return b.price - a.price || b.popularity_score - a.popularity_score; // Sort by price descending, popularity as tiebreaker
            }
            return 0;
        });
        setSortedProducts(sorted);
    };

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
            <h1>Search Results for "{query}"</h1>

            {/* Sort Buttons */}
            <div className="sort-buttons">
                <button onClick={() => handleSort('popularity_score')}>Sort by Popularity</button>
                <button onClick={() => handleSort('price')}>Sort by Price</button>
            </div>

            {sortedProducts.length > 0 ? (
                <div className="product-grid">
                    {sortedProducts.map((product) => (
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
