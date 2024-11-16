import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To access search results passed via state
import axios from 'axios';
import '../styles/ProductListPage.css'; // Ensure you style your page

const ProductListPage = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get search results passed from Header (if any)
    const searchResults = location.state?.searchResults;

    useEffect(() => {
        if (searchResults) {
            // If search results are passed, use them
            setProducts(searchResults);
            setIsLoading(false);
        } else {
            // Fetch all products if no search results are passed
            axios.get('/products/')
                .then((response) => {
                    setProducts(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching products:', error);
                    setError('Failed to fetch products. Please try again later.');
                    setIsLoading(false);
                });
        }
    }, [searchResults]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="product-list-page">
            <h1>{searchResults ? 'Search Results' : 'All Products'}</h1>
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.product_id} className="product-card">
                        <img
                            src={product.image_url || 'https://via.placeholder.com/150'}
                            alt={product.model}
                            className="product-image"
                        />
                        <h2>{product.model}</h2>
                        <p>{product.description}</p>
                        <p><strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}</p>
                        <button>
                            <Link to={`/products/${product.product_id}`}>View Details</Link>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductListPage;
