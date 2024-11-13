import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faSearch, faBars, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleCategories = () => setShowCategories(!showCategories);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        console.log("User logged in"); // Logging login action
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        console.log("User logged out"); // Logging logout action
    };

    // useEffect to log the login state
    useEffect(() => {
        console.log("isLoggedIn state changed:", isLoggedIn); // Logging state changes
    }, [isLoggedIn]);

    return (
        <>
            <header className="main-header">
                <div className="header-container">
                    {/* Menu Button */}
                    <button className="nav-toggle" onClick={toggleCategories}>
                        <FontAwesomeIcon icon={faBars} /> Menu
                    </button>

                    {/* Logo */}
                    <Link to="/" className="logo">My Shoe Store</Link>

                    {/* Right Side: Search and Icons */}
                    <div className="header-right">
                        <form onSubmit={handleSearch} className="search-bar">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="icon-button search-icon">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </form>

                        <Link to="/favorites" className="icon-button favorites-icon">
                            <FontAwesomeIcon icon={faHeart} />
                        </Link>
                        <Link to="/cart" className="icon-button">
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </Link>

                        {/* Conditional Rendering based on login state */}
                        {isLoggedIn ? (
                            <>
                                <Link to="/profile" className="text-link">Profile</Link>
                                <button className="text-link" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-link">Sign In</Link>
                                <Link to="/signup" className="text-link">Sign Up</Link>
                            </>
                        )}

                        {/* Toggle Button for Testing */}
                        <button onClick={() => setIsLoggedIn(!isLoggedIn)} className="text-link">
                            Toggle Login State
                        </button>
                    </div>
                </div>
            </header>

            {/* Dropdown Categories */}
            <div className={`dropdown-categories ${showCategories ? 'show' : ''}`}>
                <ul className="categories-list">
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
