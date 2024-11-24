import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    const [averageRating, setAverageRating] = useState(product.avg_rating || 0); // Fetch directly from the product object
    const [userRating, setUserRating] = useState(0);
    const [popularityScore, setPopularityScore] = useState(product.popularity_score || 0); // Use initial value from the product object

    useEffect(() => {
        // Fetch the updated popularity score (if needed)
        fetch(`http://localhost:8000/products/${product.product_id}/popularity/`)
            .then((response) => response.json())
            .then((data) => setPopularityScore(data.popularity_score || 0))
            .catch((error) => console.error('Error fetching popularity score:', error));
    }, [product.product_id]);

    const handleAddRating = (rating) => {
        const userId = localStorage.getItem('userId');
        const customerId = userId ? userId : null;

        if (!customerId) {
            alert("Please log in to submit a rating.");
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
                <button className="btn btn-outline-primary">
                    Add to Cart
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
