import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';
import { useUser } from '../context/UserContext'; // Assuming you have UserContext to get userRole

const ProductCard = ({ product }) => {
    const [averageRating, setAverageRating] = useState(product.avg_rating || 0);
    const [userRating, setUserRating] = useState(0);
    const [popularityScore, setPopularityScore] = useState(product.popularity_score || 0);
    const [loading, setLoading] = useState(false); // Loading state for Add to Cart
    const { userRole } = useUser(); // Get user role from context

    useEffect(() => {
        fetch(`http://localhost:8000/products/${product.product_id}/popularity/`)
            .then((response) => response.json())
            .then((data) => setPopularityScore(data.popularity_score || 0))
            .catch((error) => console.error('Error fetching popularity score:', error));
    }, [product.product_id]);

    const handleAddRating = (rating) => {
        const userId = localStorage.getItem('userId');
        const customerId = userId ? userId : null;

        if (!customerId) {
            alert('Please log in to submit a rating.');
            return;
        }

        fetch(`http://localhost:8000/products/${product.product_id}/add_rating/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rating_value: rating,
                customer_id: customerId,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to submit rating');
                }
                return response.json();
            })
            .then(() => {
                setUserRating(rating);
                alert(`You rated this product ${rating} stars!`);
            })
            .catch((error) => {
                console.error('Error submitting rating:', error);
                alert('Failed to submit rating. Please try again.');
            });
    };

    const handleAddToCart = async () => {
        setLoading(true);

        const quantity = 1; // Default quantity
        const endpoint = 'http://127.0.0.1:8000/cart/add/';
        let body = {};
        let headers = { 'Content-Type': 'application/json' };

        try {
            if (userRole === 'guest') {
                const sessionId = localStorage.getItem('session_id');
                if (!sessionId) {
                    alert('Session ID not found. Please reload the page.');
                    setLoading(false);
                    return;
                }

                body = {
                    owner_type: 'guest',
                    session_id: sessionId,
                    product_id: product.product_id,
                    quantity,
                };
            } else if (userRole === 'customer') {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    alert('Authorization token not found. Please log in again.');
                    setLoading(false);
                    return;
                }

                body = {
                    owner_type: 'customer',
                    product_id: product.product_id,
                    quantity,
                };
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                alert('Invalid user role.');
                setLoading(false);
                return;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Failed to add product to cart.');
            }

            alert('Product successfully added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-card">
            <img
                src={product.image_url || 'https://via.placeholder.com/150'}
                alt={product.model}
                className="product-image"
            />
            <div className="product-info">
                <h3>{product.model}</h3>
                <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
                <p>Average Rating: {averageRating} / 5</p>
                <p>Popularity: {popularityScore}</p>
                <div className="rating-section">
                    <div className="stars-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${userRating >= star ? 'selected' : ''}`}
                                onClick={() => handleAddRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="product-actions">
                <button
                    className="btn btn-outline-primary"
                    onClick={handleAddToCart}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add to Cart'}
                </button>
                <button className="btn btn-outline-success">
                    Add to Favorites
                </button>
                <Link to={`/products/${product.product_id}`} className="btn btn-outline-info">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
