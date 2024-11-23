import React, { useEffect, useState } from 'react';
import '../styles/CartPage.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/cart/')
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch cart items');
                return response.json();
            })
            .then((data) => {
                setCartItems(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleRemoveFromCart = (productId) => {
        fetch('http://localhost:8000/cart/remove/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to remove from cart');
                setCartItems((prevItems) =>
                    prevItems.filter((item) => item.product_id !== productId)
                );
            })
            .catch((err) => alert(err.message));
    };

    if (loading) return <div>Loading your cart...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="cart-page">
            <h2 className="cart-title">Shopping Cart</h2>
            {cartItems.length > 0 ? (
                <div className="cart-grid">
                    {cartItems.map((item) => (
                        <div key={item.product_id} className="cart-item">
                            <img
                                src={item.image_url || 'https://via.placeholder.com/150'}
                                alt={item.model}
                                className="cart-item-image"
                            />
                            <div className="cart-item-info">
                                <h3>{item.model}</h3>
                                <p><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                            </div>
                            <button
                                className="btn btn-remove"
                                onClick={() => handleRemoveFromCart(item.product_id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="empty-cart">Your cart is empty.</p>
            )}
            {cartItems.length > 0 && (
                <button className="btn btn-checkout">Proceed to Checkout</button>
            )}
        </div>
    );
};

export default CartPage;
