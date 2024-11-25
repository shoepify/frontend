import React, { useState, useEffect } from 'react';
import '../styles/CartPage.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]); // State to hold cart items
    const [loading, setLoading] = useState(true);   // State for loading
    const [error, setError] = useState(null);       // State for error handling
    const [totalPrice, setTotalPrice] = useState(0); // State for total price

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        const url = `http://localhost:8000/cart_customer/${userId}/`; // Endpoint for customer cart

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch cart data');
                }
                return response.json();
            })
            .then((data) => {
                const cartItems = data.cart_items || [];
                return Promise.all(
                    cartItems.map((item) => {
                        // Validate product existence and product_id
                        if (!item.product || !item.product.product_id) {
                            console.error('Invalid item structure:', item);
                            throw new Error('Cart item is missing product or product_id');
                        }

                        const productId = item.product.product_id;

                        // Fetch product details by product_id
                        return fetch(`http://localhost:8000/products/${productId}/`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`Failed to fetch product data for product_id: ${productId}`);
                                }
                                return response.json();
                            })
                            .then((productData) => ({
                                ...productData,
                                product_quantity: item.quantity, // Add quantity from CartItem
                                total_price: item.quantity * productData.price, // Calculate total price
                            }));
                    })
                );
            })
            .then((products) => {
                setCartItems(products);
                setTotalPrice(products.reduce((sum, item) => sum + item.total_price, 0)); // Calculate total cart price
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading cart items...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.product_id} className="cart-item">
                                <img
                                    src={item.image_url || 'https://via.placeholder.com/150'}
                                    alt={item.model}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-details">
                                    <h3>{item.model}</h3>
                                    <p>Serial Number: {item.serial_number}</p>
                                    <p>Price: ${parseFloat(item.price).toFixed(2)}</p>
                                    <p>Quantity: {item.product_quantity}</p>
                                    <p>Total: ${parseFloat(item.total_price).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Total Price: ${parseFloat(totalPrice).toFixed(2)}</h3>
                        <button className="btn btn-primary">Proceed to Payment</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
