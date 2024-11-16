import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Optional blur effect
import axios from 'axios';
import '../styles/ProductDetailPage.css'; // Add your CSS for styling

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch product details and reviews
        const fetchData = async () => {
            try {
                const productResponse = await axios.get(`http://localhost:8000/products/${productId}/`);
                const reviewsResponse = await axios.get(`http://localhost:8000/products/${productId}/comments/`);
                setProduct(productResponse.data);
                setReviews(reviewsResponse.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product data:", err);
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };
        fetchData();
    }, [productId]);

    const handleAddReview = async () => {
        if (!newReview.trim()) {
            alert('Please enter a review before submitting.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/products/${productId}/add_comment/`, {
                comment: newReview,
            });
            setReviews([...reviews, response.data]); // Add new review to the list
            setNewReview(''); // Clear the input field
        } catch (err) {
            console.error('Error adding review:', err);
            alert('Failed to add review. Please try again later.');
        }
    };

    const handleAddRating = async () => {
        if (rating <= 0 || rating > 5) {
            alert('Please enter a valid rating between 1 and 5.');
            return;
        }

        try {
            await axios.post(`http://localhost:8000/products/${productId}/add_rating/`, {
                rating_value: rating,
            });
            alert('Rating submitted successfully!');
        } catch (err) {
            console.error('Error adding rating:', err);
            alert('Failed to add rating. Please try again later.');
        }
    };

    const handleAddToWishlist = async () => {
        try {
            await axios.post(`http://localhost:8000/wishlist/1/add/${productId}/`); // Replace 1 with actual customer ID
            alert('Product added to wishlist!');
        } catch (err) {
            console.error('Error adding to wishlist:', err);
            alert('Failed to add product to wishlist. Please try again later.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="product-details">
            {product && (
                <>
                    <h1>{product.model}</h1>
                    <LazyLoadImage
                        src={product.image_url || "https://via.placeholder.com/150"}
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

                    {/* Add to Wishlist */}
                    <button onClick={handleAddToWishlist} className="btn btn-primary">
                        Add to Wishlist
                    </button>

                    {/* Add Rating */}
                    <div className="rating-section">
                        <h3>Rate this Product</h3>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            placeholder="Enter rating (1-5)"
                        />
                        <button onClick={handleAddRating} className="btn btn-success">Submit Rating</button>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section">
                        <h3>Reviews</h3>
                        <ul>
                            {reviews.map((review) => (
                                <li key={review.comment_id}>
                                    <p>{review.comment}</p>
                                </li>
                            ))}
                        </ul>

                        {/* Add a Review */}
                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Write your review here"
                        />
                        <button onClick={handleAddReview} className="btn btn-secondary">
                            Submit Review
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductDetailPage;
