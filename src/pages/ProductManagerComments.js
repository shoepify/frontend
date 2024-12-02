import React, { useState, useEffect } from 'react';

const ProductManagerPage = () => {
    const [pendingComments, setPendingComments] = useState([]); // State for pending comments
    const [loading, setLoading] = useState(true);               // State for loading
    const [error, setError] = useState(null);                   // State for error handling

    // Fetch pending comments from the backend
    useEffect(() => {
        fetch('http://localhost:8000/pending_comments/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch pending comments');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Backend Response:', data); // Log the response
                if (Array.isArray(data)) {
                    setPendingComments(data); // If it's an array
                } else if (data.comments) {
                    setPendingComments(data.comments); // If it's an object with `comments` key
                } else {
                    throw new Error('Unexpected response format');
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleApprove = (commentId) => {
        fetch(`http://localhost:8000/update_approval/${commentId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ approval_status: 'approved' }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to approve the comment');
                }
                setPendingComments((prevComments) =>
                    prevComments.filter((comment) => comment.comment_id !== commentId)
                );
            })
            .catch((err) => {
                alert('Error approving comment: ' + err.message);
            });
    };

    const handleDisapprove = (commentId) => {
        fetch(`http://localhost:8000/disapprove_comment/${commentId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to disapprove the comment');
                }
                // Remove the comment from the list after disapproval
                setPendingComments((prevComments) =>
                    prevComments.filter((comment) => comment.comment_id !== commentId)
                );
            })
            .catch((err) => {
                alert('Error disapproving comment: ' + err.message);
            });
    };
    

    if (loading) {
        return <p>Loading pending comments...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (pendingComments.length === 0) {
        return <p>No pending comments found.</p>;
    }

    return (
        <div>
            <h1>Pending Comments</h1>
            {pendingComments.map((comment) => (
                <div key={comment.comment_id} style={styles.commentCard}>
                    <p>
                        <strong>Customer ID:</strong>{' '}
                        {comment.customer_id}
                    </p>
                    <p><strong>Comment:</strong> {comment.comment}</p>
                    <div style={styles.buttonContainer}>
                        <button
                            style={styles.approveButton}
                            onClick={() => handleApprove(comment.comment_id)}
                        >
                            Approve
                        </button>
                        <button
                            style={styles.deleteButton}
                            onClick={() => handleDisapprove(comment.comment_id)}
                        >
                            Disapprove
                        </button>
                    </div>
                </div>
            ))}
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
    buttonContainer: {
        display: 'flex',
        gap: '10px',
    },
    approveButton: {
        padding: '8px 16px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default ProductManagerPage;
