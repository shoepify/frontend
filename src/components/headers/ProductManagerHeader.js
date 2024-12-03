import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/ProductManagerHeader.css";
import { useUser } from "../../context/UserContext";

const ProductManagerHeader = () => {
    const navigate = useNavigate();
    const { setUserRole } = useUser();

    const handleLogout = async () => {
        try {
            // Clear user-specific session data
            sessionStorage.clear();

            // Reset the user role to "guest"
            setUserRole("guest");

            // Fetch new guest session details
            const response = await fetch("http://127.0.0.1:8000/");
            if (!response.ok) {
                throw new Error("Failed to fetch guest session data");
            }
            const data = await response.json();

            // Store new guest session details in sessionStorage
            sessionStorage.setItem("guest_id", data.guest_id);
            sessionStorage.setItem("session_id", data.session_id);
            sessionStorage.setItem("created_at", data.created_at);

            // Navigate to the homepage
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
            alert("An error occurred while logging out. Please try again.");
        }
    };

    return (
        <header className="product-manager-header">
            <div className="header-container">
                {/* Logo */}
                <Link to="/" className="logo">
                    Store
                </Link>

                {/* Navigation Links */}
                <nav className="nav-buttons">
                    <Link to="/comments" className="nav-button">
                        Comments
                    </Link>
                    <div className="divider" />
                    <Link to="/manage-products" className="nav-button">
                        Products
                    </Link>
                    <div className="divider" />
                    <Link to="/manage-products/add" className="nav-button">
                        Products
                    </Link>
                    <div className="divider" />
                    <Link to="/product_manager/orders" className="nav-button">
                        Orders
                    </Link>
                    <div className="divider" />
                    <Link to="/manage_categories" className="nav-button">
                        Categories
                    </Link>
                </nav>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button onClick={handleLogout} className="action-button">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ProductManagerHeader;