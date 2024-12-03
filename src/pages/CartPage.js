import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [mockPaymentVisible, setMockPaymentVisible] = useState(false); // Payment modal
    const [userId, setUserId] = useState(null);

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

    const handleProceedToPayment = () => {
        fetch(`http://127.0.0.1:8000/check_cart/${userId}/`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    setMockPaymentVisible(true);
                }
            })
            .catch((error) => {
                console.error("Error checking cart:", error);
                alert("Error checking cart.");
            });
    };

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

                    // Open the invoice directly as a PDF
                    const invoiceUrl = `http://localhost:8000/invoice/${data.order_id}/create-pdf/`;
                    window.open(invoiceUrl, "_blank"); // Open the invoice in a new tab
                }
                setMockPaymentVisible(false);
            })
            .catch((error) => {
                console.error("Error placing order:", error);
                alert("Error placing order.");
            });
    };

    const handleCancelPayment = () => {
        setMockPaymentVisible(false);
    };

    if (loading) return <p style={styles.message}>Loading cart items...</p>;
    if (error) return <p style={styles.error}>Error: {error}</p>;

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
                    <button onClick={handleConfirmPayment} style={styles.confirmButton}>
                        Yes
                    </button>
                    <button onClick={handleCancelPayment} style={styles.cancelButton}>
                        No
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#333",
    },
    heading: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#444",
    },
    cart: {
        display: "flex",
        justifyContent: "space-between",
    },
    cartItems: {
        width: "60%",
    },
    cartItem: {
        display: "flex",
        alignItems: "center",
        marginBottom: "15px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
    },
    itemImage: {
        width: "100px",
        height: "100px",
        marginRight: "15px",
        borderRadius: "5px",
    },
    itemDetails: {
        flex: 1,
    },
    removeButton: {
        backgroundColor: "#ff4d4d",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "5px",
        cursor: "pointer",
    },
    cartSummary: {
        width: "35%",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
    },
    summaryItem: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
    },
    total: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
        fontSize: "1.2em",
        fontWeight: "bold",
    },
    checkoutButton: {
        width: "100%",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        padding: "10px",
        marginTop: "15px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1em",
    },
    modal: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    confirmButton: {
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        padding: "10px 15px",
        marginRight: "10px",
        borderRadius: "5px",
        cursor: "pointer",
    },
    cancelButton: {
        backgroundColor: "#ff4d4d",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "5px",
        cursor: "pointer",
    },
    message: {
        textAlign: "center",
        fontSize: "1.2em",
        color: "#666",
    },
    error: {
        textAlign: "center",
        fontSize: "1.2em",
        color: "#d9534f",
    },
};

export default Cart;
