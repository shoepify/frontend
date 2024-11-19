import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart, onAddToFavorites }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [showComments, setShowComments] = useState(false);

    // Fetch comments and ratings
    useEffect(() => {
        fetch(`http://localhost:8000/products/${product.product_id}/comments/`, {
            credentials: 'include', // Include cookies for session authentication
        })
            .then((response) => response.json())
            .then((data) => setComments(data))
            .catch((error) => console.error('Error fetching comments:', error));

        fetch(`http://localhost:8000/products/${product.product_id}/ratings/`, {
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                const totalRatings = data.reduce((sum, rating) => sum + rating.rating_value, 0);
                const avgRating = data.length ? totalRatings / data.length : 0;
                setAverageRating(avgRating.toFixed(1));
                // Optionally set userRating if backend sends user-specific data
            })
            .catch((error) => console.error('Error fetching ratings:', error));
    }, [product.product_id]);

    // Add a comment
    const handleAddComment = () => {
        if (!newComment.trim()) return; // Prevent empty comments
        fetch(`http://localhost:8000/products/${product.product_id}/add_comment/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ comment: newComment }),
        })
            .then((response) => response.json())
            .then((data) => {
                setComments([...comments, data]); // Add the new comment to the list
                setNewComment(''); // Clear the input field
            })
            .catch((error) => console.error('Error adding comment:', error));
    };

    // Add a rating
    const handleAddRating = (rating) => {
        setUserRating(rating); // Optimistically set the rating
        fetch(`http://localhost:8000/products/${product.product_id}/add_rating/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ rating_value: rating }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to submit rating');
                }
                return response.json();
            })
            .then(() => {
                console.log(`Successfully rated product with ${rating} stars`);
            })
            .catch((error) => {
                console.error('Error adding rating:', error);
                setUserRating(0); // Reset rating if API call fails
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
                <div className="rating">
                    {Array.from({ length: 5 }, (_, index) => (
                        <span
                            key={index}
                            className={`star ${userRating > index ? 'selected' : ''}`}
                            onClick={() => handleAddRating(index + 1)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>
            <div className="product-actions">
                <button
                    className="btn btn-outline-primary"
                    onClick={() => onAddToCart(product.product_id)}
                >
                    Add to Cart
                </button>
                <button
                    className="btn btn-outline-success"
                    onClick={() => onAddToFavorites(product.product_id)}
                >
                    Add to Favorites
                </button>
                <Link
                    to={`/products/${product.product_id}`}
                    className="btn btn-outline-info"
                >
                    View Details
                </Link>
            </div>
            <button
                className="btn btn-comments"
                onClick={() => setShowComments(!showComments)}
            >
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
                    <button className="btn btn-submit" onClick={handleAddComment}>
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
