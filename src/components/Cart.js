// Cart.js
import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItemsCount }) => {
    return (
        <Link to="/cart" className="btn btn-outline-secondary position-relative">
            🛒
            {cartItemsCount > 0 && (
                <span className="cart-count-badge">{cartItemsCount}</span>
            )}
        </Link>
    );
};

export default Cart;
