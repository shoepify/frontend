import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart,
    faShoppingCart,
    faSearch,
    faBars,
    faUser,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [role, setRole] = useState('Dummy User'); // Default role is "Dummy User"
    const navigate = useNavigate();

    const toggleCategories = () => setShowCategories(!showCategories);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            alert('Please enter a search term');
            return;
        }

        try {
            const response = await axios.get('/products/search/', {
                params: { query: searchQuery }, // Send search query to the backend
            });

            if (response.data && response.data.length > 0) {
                setSearchResults(response.data); // Update search results state
                navigate('/products', { state: { searchResults: response.data } }); // Navigate to the product list page with search results
            } else {
                alert('No products found');
            }
        } catch (error) {
            console.error('Error searching for products:', error);
            alert('Failed to fetch search results. Please try again later.');
        }
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const toggleRole = () => {
        const roles = ['Dummy User', 'Customer', 'Admin', 'Sales Manager', 'Product Manager'];
        const currentIndex = roles.indexOf(role);
        const nextIndex = (currentIndex + 1) % roles.length;
        setRole(roles[nextIndex]);
    };

    const renderMenuSections = () => {
        switch (role) {
            case 'Sales Manager':
                return (
                    <>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/discounts">Discounts</Link></li>
                        <li><Link to="/invoices">Invoices</Link></li>
                    </>
                );
            case 'Product Manager':
                return (
                    <>
                        <li><Link to="/header">Header</Link></li>
                        <li><Link to="/comments">Comments</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/categories">Categories</Link></li>
                    </>
                );
            case 'Customer':
            case 'Dummy User':
                return (
                    <>
                        <li><Link to="/men">Men</Link></li>
                        <li><Link to="/women">Women</Link></li>
                        <li><Link to="/kids">Kids</Link></li>
                        <li><Link to="/sports">Sports</Link></li>
                        <li><Link to="/classic">Classic</Link></li>
                    </>
                );
            case 'Admin':
                return (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/users">Users</Link></li>
                        <li><Link to="/settings">Settings</Link></li>
                    </>
                );
            default:
                return (
                    <>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </>
                );
        }
    };

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

                        {/* Role Display and Toggle Button */}
                        <p className="current-role">Current Role: {role}</p>
                        <button onClick={toggleRole} className="text-link">
                            Change Role
                        </button>
                    </div>
                </div>
            </header>

            {/* Dropdown Categories */}
            <div className={`dropdown-categories ${showCategories ? 'show' : ''}`}>
                <ul className="categories-list">
                    {renderMenuSections()}
                </ul>
            </div>
        </>
    );
};

export default Header;
