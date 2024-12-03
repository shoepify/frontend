import React, { useState } from "react";
import '../styles/OrderProductCard.css';

const OrderProductCard = ({ product }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);

    // Handle comment submission
    const handleAddComment = () => {
        if (!comment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        fetch(`http://localhost:8000/products/${product.product_id}/add_comment/`, {
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
                setComment(""); // Clear comment field
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

        fetch(`http://localhost:8000/products/${product.product_id}/add_rating/`, {
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
                setRating(0); // Clear rating field
            })
            .catch((error) => {
                console.error("Error submitting rating:", error);
                alert("Failed to submit rating. Please try again.");
            });
    };

    return (
        <div className="order-product-card">
            <div className="order-product-info">
                <h4>{product.product_model}</h4>
                <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
                <p>Quantity: {product.quantity}</p>
            </div>

            {/* Add Comment Section */}
            <div className="add-comment">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    className="comment-input"
                ></textarea>
                <button onClick={handleAddComment} className="btn btn-primary">
                    Submit Comment
                </button>
            </div>

            {/* Add Rating Section */}
            <div className="add-rating">
                <label htmlFor="rating">Rate this product:</label>
                <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="rating-select"
                >
                    <option value="0">Select Rating</option>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <option key={star} value={star}>
                            {star} Star{star > 1 ? "s" : ""}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddRating} className="btn btn-success">
                    Submit Rating
                </button>
            </div>
        </div>
    );
};

export default OrderProductCard;
