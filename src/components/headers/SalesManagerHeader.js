import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars } from "@fortawesome/free-solid-svg-icons";
import '../../styles/SalesManagerHeader.css';
import { useUser } from "../../context/UserContext";


const SalesManagerHeader = () => {
    const navigate = useNavigate();
    const { setUserRole } = useUser(); // Ensure this works

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
        <header className="main-header">
            <div className="header-container">
                {/* Menu Button */}
                <button className="nav-toggle">
                    <FontAwesomeIcon icon={faBars} /> Menu
                </button>

                {/* Logo */}
                <Link to="/" className="logo">My Shoe Store</Link>

                {/* Navigation Links (Fixed Sections) */}
                <nav className="fixed-sections">
                    <Link to="/header" className="header-button">Header</Link>
                    <Link to="/products" className="header-button">Products</Link>
                    <Link to="/discounts" className="header-button">Discounts</Link>
                    <Link to="/invoices" className="header-button">Invoices</Link>
                </nav>

                {/* Right Section */}
                <div className="header-right">
                    <Link to="/cart" className="icon-button">
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </Link>
                    <button onClick={handleLogout} className="header-button logout-button">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default SalesManagerHeader;
