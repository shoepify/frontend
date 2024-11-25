import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/ProductManagerHeader.css';
import { useUser } from "../../context/UserContext";

const ProductManagerHeader = () => {
    const navigate = useNavigate();
    const { setUserRole } = useUser();

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        setUserRole("guest");

        // Navigate to homepage or login page
        navigate("/");
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
