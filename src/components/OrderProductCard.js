import React, { useState, useEffect } from "react";
import "../styles/OrderProductCard.css";

const OrderProductCard = ({ product }) => {
    const [productDetails, setProductDetails] = useState(product);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(!product.price); // Fetch details only if price is missing

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

    if (loading) return <div>Loading product details...</div>;

    return (
        <div className="order-product-card">
            <div className="order-product-info">
                <img
                    src={`/images/${productDetails.image_name}`}
                    alt={productDetails.model}
                    className="product-image"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }} // Image size adjustment
                />
                <h4>{productDetails.model}</h4>
                <p>Price: ${parseFloat(productDetails.price).toFixed(2)}</p>
                <p>Quantity: {product.quantity}</p>
            </div>

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
