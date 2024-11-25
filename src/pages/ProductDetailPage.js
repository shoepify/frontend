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
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

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

    const fetchComments = () => {
        fetch(`http://127.0.0.1:8000/products/${productId}/comments/`)
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch comments');
                return response.json();
            })
            .then((data) => {
                // Filter and display only approved comments
                const approvedComments = data.filter(comment => comment.approval_status === 'approved');
                setComments(approvedComments);
            })
            .catch((err) => console.error('Error fetching comments:', err));
    };

    const handleAddComment = () => {
        const userId = localStorage.getItem('userId');
        const customerId = userId ? userId : null;

        if (!customerId) {
            alert("Please log in to submit a comment.");
            return;
        }

        fetch(`http://localhost:8000/products/${productId}/add_comment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment: newComment,
                customer_id: customerId,
            }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to submit comment');
                return response.json();
            })
            .then(() => {
                alert('Comment submitted successfully!');
                setNewComment(''); // Clear the comment input
                fetchComments(); // Refresh the list of comments
            })
            .catch((error) => {
                console.error('Error submitting comment:', error);
                alert('Failed to submit comment. Please try again.');
            });
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

        fetchComments(); // Fetch comments when the page loads
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

                    {/* Comments Section */}
                    <div className="comments-section">
                        <h2>Comments</h2>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <p key={comment.comment_id}>
                                    <strong>{comment.customer?.name || 'Anonymous'}:</strong> {comment.comment}
                                </p>
                            ))
                        ) : (
                            <p>No comments yet. Be the first to comment!</p>
                        )}
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="comment-input"
                        ></textarea>
                        <button className="btn btn-outline-success" onClick={handleAddComment}>
                            Submit Comment
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductDetailPage;
