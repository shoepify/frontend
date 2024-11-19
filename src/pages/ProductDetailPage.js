import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Optional blur effect
import { decodeToken } from '../utils/auth'; // Import the utility function

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleAddToFavorites = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to add favorites.");
            return;
        }

        const decoded = decodeToken(token);
        if (!decoded || !decoded.user_id) {
            alert("Invalid token. Please log in again.");
            return;
        }

        fetch("http://localhost:8000/favorites/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Include the token
            },
            body: JSON.stringify({ product_id: productId }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to add to favorites");
                alert("Product added to favorites!");
            })
            .catch((err) => alert(err.message));
    };

    useEffect(() => {
        fetch(`http://localhost:8000/products/${productId}/`)
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch product details');
                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
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
                    <LazyLoadImage
                        src={product.image_url || 'https://via.placeholder.com/150'}
                        alt={product.model}
                        effect="blur"
                        className="product-image"
                    />
                    <p><strong>Serial Number:</strong> {product.serial_number}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                    <p><strong>Warranty Status:</strong> {product.warranty_status}</p>
                    <p><strong>Distributor Info:</strong> {product.distributor_info}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Base Price:</strong> ${parseFloat(product.base_price).toFixed(2)}</p>
                    <p><strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}</p>

                    {/* Add to Favorites Button */}
                    <button className="btn btn-outline-primary" onClick={handleAddToFavorites}>
                        Add to Favorites
                    </button>
                </>
            )}
        </div>
    );
};

export default ProductDetailPage;
