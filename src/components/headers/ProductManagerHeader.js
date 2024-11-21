import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import '../../styles/ProductManagerHeader.css';
import { useUser } from "../../context/UserContext";


const ProductManagerHeader = () => {
    const navigate = useNavigate();
    const { setUserRole } = useUser(); // Ensure this works


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

                {/* Navigation Links (Fixed Sections) */}
                <nav className="fixed-sections">
                    <Link to="/comments" className="header-button">Comments</Link>
                    <Link to="/products" className="header-button">Products</Link>
                    <Link to="/categories" className="header-button">Categories</Link>
                </nav>

                {/* Logout Button */}
                <div className="header-right">
                    <button onClick={handleLogout} className="header-button logout-button">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ProductManagerHeader;



