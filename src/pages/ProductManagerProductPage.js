import React, { useState, useEffect } from 'react';
import ProductManagerProductCard from '../components/ProductManagerProductCard';

const ProductManagerProductPage = () => {
    const [products, setProducts] = useState([]); // Initialize as an empty array
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch products from API
        fetch('http://localhost:8000/products/') // Replace with your API endpoint
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    const handleEditProduct = (productId) => {
        console.log(`Edit product: ${productId}`);
        // Navigate to edit page or show a modal
    };

    const handleDeleteProduct = (productId) => {
        console.log(`Delete product: ${productId}`);
        // Send a DELETE request to the backend and update state
        setProducts((prevProducts) => prevProducts.filter((p) => p.product_id !== productId));
    };

    if (isLoading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Product Manager: Manage Products</h1>
            <div className="product-grid">
                {products.map((product) => (
                    <ProductManagerProductCard
                        key={product.product_id}
                        product={product}
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductManagerProductPage;
