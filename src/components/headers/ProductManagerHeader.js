import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/ProductManagerHeader.css';
import { useUser } from "../../context/UserContext";

const ProductManagerHeader = () => {
    const navigate = useNavigate();
    const { setUserRole } = useUser();

    const handleLogout = () => {
        // Clear user-specific session data
        sessionStorage.clear();
    
        // Reset the role in context
        setUserRole("guest");
    
        // Fetch new guest session data
        fetch("http://127.0.0.1:8000/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch guest info");
                }
                return response.json();
            })
            .then((data) => {
                // Store new guest info in session storage
                sessionStorage.setItem("guest_id", data.guest_id);
                sessionStorage.setItem("session_id", data.session_id);
                sessionStorage.setItem("created_at", data.created_at);
    
                // Navigate to the homepage or guest-specific page
                navigate("/");
            })
            .catch((error) => {
                console.error("Error fetching guest info:", error);
                // Optionally, handle errors (e.g., display an error message)
            });
    };
    

    return (
        <header className="product-manager-header">
            <div className="header-container">
                {/* Logo */}
                <Link to="/" className="logo">My Shoe Store</Link>

                {/* Navigation Links */}
                <nav className="nav-buttons">
                    <Link to="/comments" className="nav-button">Comments</Link>
                    <div className="divider" />
                    <Link to="/manage-products" className="nav-button">View Products</Link>
                    <div className="divider" />
                    <Link to="/manage-products/add" className="nav-button">Add Products</Link>
                    <div className="divider" />
                    <Link to="/categories" className="nav-button">Categories</Link>
                </nav>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button onClick={handleLogout} className="action-button">Logout</button>
                </div>
            </div>
        </header>
    );
};

export default ProductManagerHeader;
