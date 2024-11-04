import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSignInAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

const Header = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    // Close the sidebar if the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setShowSidebar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    return (
        <>
            {/* Header with logo, search bar, and icons */}
            <header className="navbar navbar-light bg-light">
                <div className="container d-flex align-items-center">
                    {/* Toggle Sidebar Button */}
                    <button className="btn" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} /> Menu
                    </button>

                    {/* Logo */}
                    <Link to="/" className="navbar-brand ms-3">My Shoe Store</Link>

                    {/* Search Bar */}
                    <form className="d-flex ms-3 me-auto" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    {/* Favorites, Cart, and Login */}
                    <div className="d-flex align-items-center">
                        <Link to="/favorites" className="btn">
                            <FontAwesomeIcon icon={faHeart} /> Favorites
                        </Link>
                        <Cart cartItemsCount={cartItemsCount} />
                        {/* Link to Login Page */}
                        <Link to="/login" className="btn btn-outline-primary">
                            <FontAwesomeIcon icon={faSignInAlt} /> Login
                        </Link>
                    </div>
                </div>
            </header>

            {/* Vertical Sidebar Navigation */}
            <div className={`sidebar ${showSidebar ? 'show' : ''}`} ref={sidebarRef}>
                <button className="close-button" onClick={toggleSidebar}>×</button>
                <ul className="sidebar-list">
                    <li><Link to="/mens">Men's Shoes</Link></li>
                    <li><Link to="/womens">Women's Shoes</Link></li>
                    <li><Link to="/kids">Kids' Shoes</Link></li>
                    <li><Link to="/accessories">Accessories</Link></li>
                    <li><Link to="/sale">Sale</Link></li>
                </ul>
            </div>
        </>
    );
};

export default Header;
