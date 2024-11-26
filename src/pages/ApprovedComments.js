import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ApprovedComments = () => {
    const { productId } = useParams(); // Extract product ID from route
    const [comments, setComments] = useState([]); // State for comments
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/products/${productId}/comments/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.status === 404) {
                    // Backend returns 404 for no comments
                    setComments([]); // Treat as no comments found
                    setLoading(false);
                    return [];
                }
                if (!response.ok) {
                    throw new Error('Unexpected error while fetching comments.');
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setComments(data); // If the response is an array
                } else if (data.comments) {
                    setComments(data.comments); // If the response has `comments` key
                } else {
                    setComments([]); // Fallback to an empty array
                }
                setLoading(false);
            })
            .catch((err) => {
                setComments([]); // Fallback to empty comments if error occurs
                setLoading(false);
            });
    }, [productId]);

    if (loading) {
        return <p>Loading approved comments...</p>;
    }

    if (comments.length === 0) {
        return <p>No approved comments found for this product.</p>;
    }

    return (
        <div>
            <h1>Approved Comments</h1>
            <div>
                {comments.map((comment) => (
                    <div key={comment.comment_id} style={styles.commentCard}>
                        <p>
                            <strong>Customer ID:</strong> {comment.customer_id}
                        </p>
                        <p>
                            <strong>Comment:</strong> {comment.comment}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    commentCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#f9f9f9',
    },
};

export default ApprovedComments;
