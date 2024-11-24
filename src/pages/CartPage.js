import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard"; // Import the ProductCard component
import "../styles/CartPage.css";

const CartPage = ({ onAddToCart }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCartItems = async () => {
        const customerId = localStorage.getItem("userId") || "guest"; // Use guest if not logged in

        try {
            const response = await fetch(`http://localhost:8000/cart/${customerId}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch cart items.");
            }

            const data = await response.json();
            setCartItems(data); // Update cart items state
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setError("Error fetching cart items. Please try again later.");
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    if (loading) {
        return <p>Loading cart items...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            {cartItems.length > 0 ? (
                <div className="cart-list">
                    {cartItems.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                            onAddToCart={onAddToCart} // Optionally allow adding more of the same item
                        />
                    ))}
                </div>
            ) : (
                <p>Your cart is empty. Start adding products!</p>
            )}
        </div>
    );
};

export default CartPage;
