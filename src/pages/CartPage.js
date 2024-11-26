import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const guestId = sessionStorage.getItem("guest_id");
        const customerId = sessionStorage.getItem("customerId");

        let userId;
        let url;

        if (customerId) {
            userId = customerId;
            url = `http://localhost:8000/cart_customer/${userId}/`;
        } else if (guestId) {
            userId = guestId;
            url = `http://localhost:8000/cart_guest/${userId}/`;
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
            url = `http://localhost:8000/customer/${customerId}/remove/${productId}/`;
        } else if (guestId) {
            url = `http://localhost:8000/guest/${guestId}/remove/${productId}/`;
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
                        <button style={styles.checkoutButton}>Proceed to Payment</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "1200px",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    },
    heading: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
        fontFamily: "'Poppins', sans-serif",
    },
    cart: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
    },
    cartItems: {
        flex: "2",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    cartItem: {
        display: "flex",
        gap: "15px",
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "5px",
        border: "1px solid #ddd",
    },
    itemImage: {
        width: "100px",
        height: "100px",
        borderRadius: "5px",
        objectFit: "cover",
    },
    itemDetails: {
        flex: "1",
    },
    cartSummary: {
        flex: "1",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "5px",
        border: "1px solid #ddd",
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
        fontSize: "18px",
    },
    removeButton: {
        marginTop: "10px",
        padding: "8px",
        fontSize: "14px",
        color: "#fff",
        backgroundColor: "#dc3545",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    checkoutButton: {
        marginTop: "20px",
        padding: "10px",
        fontSize: "16px",
        color: "#fff",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Cart;
