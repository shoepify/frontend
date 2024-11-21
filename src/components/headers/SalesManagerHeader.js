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
        // Clear localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        setUserRole("guest");


        // Navigate to homepage or login page
        navigate("/");
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
