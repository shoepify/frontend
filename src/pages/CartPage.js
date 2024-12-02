import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [mockPaymentVisible, setMockPaymentVisible] = useState(false); // For payment confirmation modal
    const [userId, setUserId] = useState(null); // Store user ID

    useEffect(() => {
        const guestId = sessionStorage.getItem("guest_id");
        const customerId = sessionStorage.getItem("customerId");

        let url;

        if (customerId) {
            setUserId(customerId);
            url = `http://localhost:8000/cart_customer/${customerId}/`;
        } else if (guestId) {
            setUserId(guestId);
            url = `http://localhost:8000/cart_guest/${guestId}/`;
        } else {
            setError("Unable to determine user type for viewing the cart.");
            setLoading(false);
            return;
        }

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch cart data");
                return response.json();
            })
            .then((data) => {
                const cartItems = data.cart_items || [];
                return Promise.all(
                    cartItems.map((item) => {
                        const productId = item.product_id;

                        return fetch(`http://localhost:8000/products/${productId}/`, {
                            method: "GET",
                            headers: { "Content-Type": "application/json" },
                        })
                            .then((response) => {
                                if (!response.ok)
                                    throw new Error(`Failed to fetch product data for product_id: ${productId}`);
                                return response.json();
                            })
                            .then((productData) => ({
                                ...productData,
                                product_quantity: item.quantity,
                                total_price: item.quantity * productData.price,
                            }));
                    })
                );
            })
            .then((products) => {
                setCartItems(products);
                setTotalPrice(products.reduce((sum, item) => sum + item.total_price, 0));
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    // Remove item from cart
    const handleRemoveFromCart = (productId) => {
        const guestId = sessionStorage.getItem("guest_id");
        const customerId = sessionStorage.getItem("customerId");

        let url;

        if (customerId) {
            url = `http://127.0.0.1:8000/customer/${customerId}/remove/${productId}/`;
        } else if (guestId) {
            url = `http://127.0.0.1:8000/guest/${guestId}/remove/${productId}/`;
        } else {
            alert("Unable to determine user type for removing the product.");
            return;
        }

        fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to remove item from cart");
                alert("Item removed from the cart.");
                setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
                setTotalPrice((prevTotal) =>
                    prevTotal - cartItems.find((item) => item.product_id === productId).total_price
                );
            })
            .catch((error) => {
                console.error(error.message);
                alert("Error removing item from cart: " + error.message);
            });
    };

    // Handle Proceed to Payment
    const handleProceedToPayment = () => {
        fetch(`http://127.0.0.1:8000/check_cart/${userId}/`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error); // Show error if cart is invalid
                } else {
                    setMockPaymentVisible(true); // Show payment modal if cart is valid
                }
            })
            .catch((error) => {
                console.error("Error checking cart:", error);
                alert("Error checking cart.");
            });
    };

    // Confirm Payment
    const handleConfirmPayment = () => {
        fetch(`http://127.0.0.1:8000/order/place/${userId}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(`Order placed successfully! Order ID: ${data.order_id}`);
                }
                setMockPaymentVisible(false); // Hide modal
            })
            .catch((error) => {
                console.error("Error placing order:", error);
                alert("Error placing order.");
            });
    };

    // Cancel Payment
    const handleCancelPayment = () => {
        setMockPaymentVisible(false); // Hide modal
    };

    if (loading) return <p>Loading cart items...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>
                <FontAwesomeIcon icon={faShoppingCart} /> Your Cart
            </h1>
            {cartItems.length === 0 ? (
                <p style={styles.message}>Your cart is empty.</p>
            ) : (
                <div style={styles.cart}>
                    <div style={styles.cartItems}>
                        {cartItems.map((item) => (
                            <div key={item.product_id} style={styles.cartItem}>
                                <img
                                    src={item.image_url || "https://via.placeholder.com/150"}
                                    alt={item.model}
                                    style={styles.itemImage}
                                />
                                <div style={styles.itemDetails}>
                                    <h3>{item.model}</h3>
                                    <p>{item.description || "No description available"}</p>
                                    <p>Quantity: {item.product_quantity}</p>
                                    <button
                                        style={styles.removeButton}
                                        onClick={() => handleRemoveFromCart(item.product_id)}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={styles.cartSummary}>
                        <h2>Order Summary</h2>
                        {cartItems.map((item) => (
                            <div key={item.product_id} style={styles.summaryItem}>
                                <span>{item.model}</span>
                                <span>${item.total_price.toFixed(2)}</span>
                            </div>
                        ))}
                        <div style={styles.total}>
                            <strong>Total</strong>
                            <strong>${totalPrice.toFixed(2)}</strong>
                        </div>
                        <button style={styles.checkoutButton} onClick={handleProceedToPayment}>
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            )}
            {mockPaymentVisible && (
                <div style={styles.modal}>
                    <p>Do you want to confirm the payment?</p>
                    <button onClick={handleConfirmPayment}>Yes</button>
                    <button onClick={handleCancelPayment}>No</button>
                </div>
            )}
        </div>
    );
};

const styles = {
    // Add your styles here
    modal: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
    },
};

export default Cart;
