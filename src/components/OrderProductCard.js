import React, { useState, useEffect } from "react";
import "../styles/OrderProductCard.css";

const OrderProductCard = ({ product, orderStatus, isRefunded, onRefundSuccess }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [isProcessingRefund, setIsProcessingRefund] = useState(false);
    const [productDetails, setProductDetails] = useState(product); // Use product as initial value
    const [loading, setLoading] = useState(true);

    // Fetch product details if price is missing
    useEffect(() => {
        if (!product.price) {
            fetch(`http://localhost:8000/products/${product.product_id}/`)
                .then((response) => {
                    if (!response.ok) throw new Error("Failed to fetch product details");
                    return response.json();
                })
                .then((data) => {
                    setProductDetails(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching product details:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [product]);

    // Handle comment submission
    const handleAddComment = () => {
        if (!comment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        fetch(`http://localhost:8000/products/${productDetails.product_id}/add_comment/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customer_id: sessionStorage.getItem("customerId"),
                comment,
            }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to submit comment");
                return response.json();
            })
            .then(() => {
                alert("Your comment has been submitted and is awaiting approval.");
                setComment("");
            })
            .catch((error) => {
                console.error("Error submitting comment:", error);
                alert("Failed to submit comment. Please try again.");
            });
    };

    // Handle rating submission
    const handleAddRating = () => {
        if (rating < 1 || rating > 5) {
            alert("Please select a rating between 1 and 5.");
            return;
        }

        fetch(`http://localhost:8000/products/${productDetails.product_id}/add_rating/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customer_id: sessionStorage.getItem("customerId"),
                rating_value: rating,
            }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to submit rating");
                return response.json();
            })
            .then(() => {
                alert(`You rated this product ${rating} stars!`);
                setRating(0);
            })
            .catch((error) => {
                console.error("Error submitting rating:", error);
                alert("Failed to submit rating. Please try again.");
            });
    };

    const handleRefundRequest = () => {
        setIsProcessingRefund(true);
        fetch(`http://localhost:8000/refund/request/${product.order_item_id}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    alert("Refund request submitted successfully!");
                    onRefundSuccess(product.order_item_id); // Update parent state
                } else {
                    alert("Refund request failed.");
                }
                setIsProcessingRefund(false);
            })
            .catch(() => {
                alert("An error occurred while processing the refund request.");
                setIsProcessingRefund(false);
            });
    };

    if (loading) return <p>Loading product details...</p>;

    return (
        <div className="order-product-card">
            <div className="order-product-info">
                <img
                    src={`/images/${product.image_name}`}
                    alt={product.product_model}
                    className="product-image"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <h4>{product.product_model}</h4>
                <p>Price: ${parseFloat(product.price_per_item).toFixed(2)}</p>
                <p>Quantity: {product.quantity}</p>
            </div>

            {isRefunded ? (
                <p style={{ color: "gray" }}>Refunded</p>
            ) : (
                <button
                    onClick={handleRefundRequest}
                    className="btn btn-danger"
                    disabled={orderStatus === "Cancelled" || isProcessingRefund}
                >
                    {isProcessingRefund ? "Processing..." : "Request Refund"}
                </button>
            )}

            <div className="add-comment">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    className="comment-input"
                    disabled={orderStatus === "Cancelled" || isRefunded}
                ></textarea>
                <button
                    onClick={handleAddComment}
                    className="btn btn-primary"
                    disabled={orderStatus === "Cancelled" || isRefunded}
                >
                    Submit Comment
                </button>
            </div>

            <div className="add-rating">
                <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="rating-select"
                    disabled={orderStatus === "Cancelled" || isRefunded}
                >
                    <option value="0">Select Rating</option>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <option key={star} value={star}>
                            {star} Star{star > 1 ? "s" : ""}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleAddRating}
                    className="btn btn-success"
                    disabled={orderStatus === "Cancelled" || isRefunded}
                >
                    Submit Rating
                </button>
            </div>
        </div>
    );
};

export default OrderProductCard;
