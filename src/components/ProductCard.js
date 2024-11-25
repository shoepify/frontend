import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    const [averageRating, setAverageRating] = useState(product.avg_rating || 0);
    const [userRating, setUserRating] = useState(0);
    const [popularityScore, setPopularityScore] = useState(product.popularity_score || 0);
    const [quantity, setQuantity] = useState(1); // Manage quantity state

    useEffect(() => {
        // Fetch updated popularity score
        fetch(`http://localhost:8000/products/${product.product_id}/popularity/`)
            .then((response) => response.json())
            .then((data) => setPopularityScore(data.popularity_score || 0))
            .catch((error) => console.error('Error fetching popularity score:', error));
    }, [product.product_id]);

    const handleAddRating = (rating) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
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
                customer_id: userId,
            }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to submit rating');
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

    const handleAddToCart = () => {
        let userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        let guestId = localStorage.getItem('guestId'); // Retrieve guestId from localStorage
    
        if (!userId && !guestId) {
            // Generate a guestId if it doesn't exist
            guestId = `guest_${Date.now()}`;
            localStorage.setItem('guestId', guestId); // Store the guestId in localStorage
        }
    
        let url;
    
        if (userId) {
            // Logged-in customer
            url = `http://localhost:8000/add_to_cart_customer/${userId}/${product.product_id}/${quantity}/`;
        } else {
            // Guest user
            url = `http://localhost:8000/add_to_cart_guest/${guestId}/${product.product_id}/${quantity}/`;
        }
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to add to cart');
                return response.json();
            })
            .then(() => {
                alert('Product successfully added to cart!');
            })
            .catch((error) => {
                console.error('Error adding to cart:', error);
                alert('Failed to add product to cart. Please try again.');
            });
    };
    
    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

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
                <div className="quantity-selector">
                    <button className="quantity-btn" onClick={decrementQuantity}>
                        -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button className="quantity-btn" onClick={incrementQuantity}>
                        +
                    </button>
                </div>
                <button className="btn btn-outline-primary" onClick={handleAddToCart}>
                    Add to Cart
                </button>
                <Link to={`/products/${product.product_id}`} className="btn btn-outline-info">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
