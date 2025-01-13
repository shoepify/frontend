import React, { useState } from "react";
import "../styles/OrderProductCard.css";

const OrderProductCard = ({ product, orderStatus, isRefunded, onRefundSuccess }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [isProcessingRefund, setIsProcessingRefund] = useState(false);

    const handleAddComment = () => {
        if (!comment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        // Add comment logic here
    };

    const handleAddRating = () => {
        if (rating < 1 || rating > 5) {
            alert("Please select a rating between 1 and 5.");
            return;
        }

        // Add rating logic here
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
                
                setIsProcessingRefund(false);
            });
    };

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

            {/* Display 'Refunded' or 'Request Refund' */}
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

            {/* Comment and Rating */}
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
