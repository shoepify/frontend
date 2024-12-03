import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ApprovedComments = () => {
    const { productId } = useParams();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/products/${productId}/comments/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.status === 404) {
                    setComments([]);
                    setLoading(false);
                    return [];
                }
                if (!response.ok) {
                    throw new Error("Unexpected error while fetching comments.");
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    const approvedComments = data.filter(comment => comment.approval_status === "Approved");
                    setComments(approvedComments);
                } else if (data.comments) {
                    const approvedComments = data.comments.filter(comment => comment.approval_status === "Approved");
                    setComments(approvedComments);
                } else {
                    setComments([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [productId]);

    if (loading) {
        return <p>Loading comments...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (comments.length === 0) {
        return <p>No approved comments found for this product.</p>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Approved Comments</h2>
            {comments.map((comment) => (
                <div key={comment.comment_id} style={styles.commentCard}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Customer ID:</label>
                        <div style={styles.value}>{comment.customer_id}</div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Comment:</label>
                        <div style={styles.value}>{comment.comment}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    heading: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
        fontFamily: "'Poppins', sans-serif",
    },
    commentCard: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "#fff",
    },
    formGroup: {
        display: "flex",
        marginBottom: "10px",
    },
    label: {
        flex: "1",
        fontWeight: "bold",
        color: "#555",
    },
    value: {
        flex: "2",
        color: "#333",
    },
};

export default ApprovedComments;
