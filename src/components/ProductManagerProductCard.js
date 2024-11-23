import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductManagerProductCard = ({ product, onEditProduct, onDeleteProduct }) => {
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    // Fetch comments
    useEffect(() => {
        fetch(`http://localhost:8000/products/${product.product_id}/comments/`, {
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => setComments(data))
            .catch((error) => console.error('Error fetching comments:', error));
    }, [product.product_id]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            onDeleteProduct(product.product_id);
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
                <p>Stock: {product.stock}</p>
            </div>
            <div className="product-actions">
                <button
                    className="btn btn-outline-warning"
                    onClick={() => onEditProduct(product.product_id)}
                >
                    Edit
                </button>
                <button
                    className="btn btn-outline-danger"
                    onClick={handleDelete}
                >
                    Delete
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
                </div>
            )}
        </div>
    );
};

export default ProductManagerProductCard;
