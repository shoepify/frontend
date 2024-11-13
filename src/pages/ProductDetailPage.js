import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Optional blur effect

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Use the API endpoint from the ProductViewSet
        const url = `http://localhost:8000/products/${productId}/`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched product data:", data); // Check the product data
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching product data:", error);
                setError(error);
                setLoading(false);
            });
    }, [productId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="product-details">
            {product && (
                <>
                    <h1>{product.model}</h1>
                    {/* Use the image_url field to display the image */}
                    <LazyLoadImage
                        src={product.image_url || "https://via.placeholder.com/150"} // Use image_url
                        alt={product.model}
                        effect="blur" // Adds a blur effect while loading
                        className="product-image"
                    />
                    <p><strong>Serial Number:</strong> {product.serial_number}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                    <p><strong>Warranty Status:</strong> {product.warranty_status}</p>
                    <p><strong>Distributor Info:</strong> {product.distributor_info}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Base Price:</strong> ${parseFloat(product.base_price).toFixed(2)}</p>
                    <p><strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}</p>
                </>
            )}
        </div>
    );
};

export default ProductDetailPage;
