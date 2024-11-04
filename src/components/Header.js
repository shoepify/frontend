import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSignInAlt, faBars } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [userRole, setUserRole] = useState('Customer');
    const menuRef = useRef(null);

    const handleLoginClick = () => setShowLogin(true);
    const closeLoginModal = () => setShowLogin(false);
    const toggleMenu = () => setShowMenu(!showMenu);

    // Close the menu if the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
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
            {/* Header with navigation and search bar */}
            <header className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container d-flex align-items-center">
                    {/* Toggle Menu Button */}
                    <button className="btn" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={faBars} /> Menu
                    </button>

                    {/* Logo */}
                    <Link to="/" className="navbar-brand">My Shoe Store</Link>

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
                        <button className="btn btn-outline-primary" onClick={handleLoginClick}>
                            <FontAwesomeIcon icon={faSignInAlt} /> Login
                        </button>
                    </div>
                </div>

                {/* Dropdown Navigation Menu Under the Header */}
                {showMenu && (
                    <div className="dropdown-menu-container" ref={menuRef}>
                        <ul className="dropdown-menu-list">
                            <li><Link to="/mens">Men's Shoes</Link></li>
                            <li><Link to="/womens">Women's Shoes</Link></li>
                            <li><Link to="/kids">Kids' Shoes</Link></li>
                            <li><Link to="/accessories">Accessories</Link></li>
                            <li><Link to="/sale">Sale</Link></li>
                        </ul>
                    </div>
                )}
            </header>

            {/* Centered Login Modal with Role Selection */}
            {showLogin && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={closeLoginModal} className="close-button">×</button>
                        <h2>Login</h2>
                        <form>
                            <div className="form-group">
                                <input type="text" placeholder="Username" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <input type="password" placeholder="Password" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label>Select Role:</label>
                                <select
                                    className="form-control"
                                    value={userRole}
                                    onChange={(e) => setUserRole(e.target.value)}
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Sales Manager">Sales Manager</option>
                                    <option value="Product Manager">Product Manager</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-login">Login</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
