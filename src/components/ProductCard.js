import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [popularityScore, setPopularityScore] = useState(0);
    const [showComments, setShowComments] = useState(false);

    // Fetch comments, ratings, and popularity score
    useEffect(() => {
        fetch(`http://localhost:8000/products/${product.product_id}/comments/`)
            .then((response) => response.json())
            .then((data) => setComments(data))
            .catch((error) => console.error('Error fetching comments:', error));
            

        // Fetch ratings
        fetch(`http://localhost:8000/products/${product.product_id}/ratings/`, {
            method: 'GET', // Explicitly specify the GET method
            headers: {
                'Content-Type': 'application/json', // Ensure the correct content type
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    const totalRatings = data.reduce((sum, rating) => sum + rating.rating_value, 0);
                    const avgRating = data.length ? totalRatings / data.length : 0;
                    setAverageRating(avgRating.toFixed(1)); // Set the average rating
                } else {
                    console.error('Invalid ratings response:', data);
                    setAverageRating('N/A'); // Handle invalid data gracefully
                }
            })
            .catch((error) => {
                console.error('Error fetching ratings:', error);
                setAverageRating('N/A'); // Set default value in case of error
            });
        }, [product.product_id]); // Dependency ensures this runs only when the product changes

        fetch(`http://localhost:8000/products/${product.product_id}/popularity/`)
            .then((response) => response.json())
            .then((data) => setPopularityScore(data.popularity_score || 0))
            .catch((error) => console.error('Error fetching popularity score:', error));
    

        const handleAddRating = (rating) => {
        const userId = localStorage.getItem('userId'); // Retrieve user ID if logged in
        const customerId = userId ? userId : null; // Use the customer ID if logged in

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
                rating_value: rating, // The rating value to submit
                customer_id: customerId, // The customer submitting the rating
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to submit rating');
                }
                return response.json();
            })
            .then(() => {
                setUserRating(rating); // Update the state with the new rating
                alert('Rating submitted successfully!');
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
                    <p>Your Rating:</p>
                    <div className="stars">
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
            <button className="btn btn-comments" onClick={() => setShowComments(!showComments)}>
                {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>
            {showComments && (
                <div className="comments-section">
                    <h4>Comments</h4>
                    {comments.map((comment) => (
                        <p key={comment.comment_id}>
                            <strong>{comment.customer?.name || 'Anonymous'}:</strong> {comment.comment}
                        </p>
                    ))}
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="comment-input"
                    ></textarea>
                    <button className="btn btn-submit">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
