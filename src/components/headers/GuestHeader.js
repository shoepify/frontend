import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart, faBars } from "@fortawesome/free-solid-svg-icons";
import '../../styles/GuestHeader.css';


const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const toggleCategories = () => setShowCategories(!showCategories);

    // Fetch categories from the backend
    useEffect(() => {
        fetch('http://localhost:8000/products/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                return response.json();
            })
            .then((data) => {
                // Extract unique categories
                const uniqueCategories = [...new Set(data.map((product) => product.category))];
                setCategories(uniqueCategories);
            })
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`);
        }
    };

    return (
        <header className="main-header">
            <div className="header-container">
                {/* Menu Button */}
                <button className="nav-toggle" onClick={toggleCategories}>
                    <FontAwesomeIcon icon={faBars} /> Menu
                </button>

                {/* Logo */}
                <Link to="/" className="logo">My Shoe Store</Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </form>

                {/* Right Section */}
                <div className="header-right">
                    <Link to="/favorites" className="icon-button">
                        <FontAwesomeIcon icon={faHeart} />
                    </Link>
                    <Link to="/cart" className="icon-button">
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </Link>

                    {!isLoggedIn ? (
                        <>
                            <Link to="/signup" className="header-button signup-button">
                                Sign Up
                            </Link>
                            <Link to="/login" className="header-button login-button">
                                Login
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsLoggedIn(false)}
                            className="header-button logout-button"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>

            {/* Dropdown Categories */}
            {showCategories && (
                <div className={`dropdown-categories ${showCategories ? 'show' : ''}`}>
                    <ul className="categories-list">
                        {categories.map((category, index) => (
                            <li key={index}>
                                <Link to={`/categories/${encodeURIComponent(category)}`}>
                                    {category}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;

