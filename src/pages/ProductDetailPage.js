import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ApprovedComments from './ApprovedComments'; // Import ApprovedComments

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        const userId = localStorage.getItem('userId');
        const customerId = userId || null;

        if (!customerId) {
            alert("Please log in to submit a comment.");
            return;
        }

        fetch(`http://localhost:8000/products/${productId}/add_comment/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment: newComment, customer_id: customerId }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to submit comment');
                return response.json();
            })
            .then(() => {
                alert('Comment submitted successfully!');
                setNewComment('');
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
                setError(err.message);
                setLoading(false);
            });
    }, [productId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="product-details" style={styles.container}>
            {product && (
                <>
                    <h1>{product.model}</h1>
                    <LazyLoadImage
                        src={product.image_url || 'https://via.placeholder.com/150'}
                        alt={product.model}
                        effect="blur"
                        className="product-image"
                        style={styles.productImage}
                    />
                    <p><strong>Serial Number:</strong> {product.serial_number}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                    <p><strong>Warranty Status:</strong> {product.warranty_status}</p>
                    <p><strong>Distributor Info:</strong> {product.distributor_info}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Base Price:</strong> ${parseFloat(product.base_price).toFixed(2)}</p>
                    <p><strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}</p>

                    {/* Add Comment Section */}
                    <div style={styles.commentsSection}>
                        <h2>Leave a Comment</h2>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write your comment..."
                            style={styles.textarea}
                        />
                        <button onClick={handleAddComment} style={styles.button}>Submit Comment</button>
                    </div>

                    {/* Approved Comments Slider */}
                    <div style={styles.approvedComments}>
                        <ApprovedComments /> {/* Render the ApprovedComments component */}
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    productImage: {
        width: "100%",
        maxWidth: "400px",
        display: "block",
        margin: "0 auto",
    },
    commentsSection: {
        marginTop: "20px",
    },
    textarea: {
        width: "100%",
        height: "80px",
        marginBottom: "10px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    approvedComments: {
        marginTop: "40px",
    },
};

export default ProductDetailPage;
