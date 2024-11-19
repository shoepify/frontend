import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart, onAddToFavorites }) => {
    const handleCartClick = () => {
        if (onAddToCart && typeof onAddToCart === 'function') {
            onAddToCart(product.product_id);
        } else {
            console.error('onAddToCart is not a valid function');
        }
    };

    const handleFavoritesClick = () => {
        if (onAddToFavorites && typeof onAddToFavorites === 'function') {
            onAddToFavorites(product.product_id);
        } else {
            console.error('onAddToFavorites is not a valid function');
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
            </div>
            <div className="product-actions">
                {/* Add to Cart Button */}
                <button
                    className="btn btn-outline-primary"
                    onClick={handleCartClick}
                >
                    Add to Cart
                </button>

                {/* Add to Favorites Button */}
                <button
                    className="btn btn-outline-success"
                    onClick={handleFavoritesClick}
                >
                    Add to Favorites
                </button>

                {/* View Details Link */}
                <Link
                    to={`/products/${product.product_id}`}
                    className="btn btn-outline-info"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
