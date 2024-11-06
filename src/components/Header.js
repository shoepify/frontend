// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSignInAlt, faShoppingCart, faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';

const Header = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleCategories = () => setShowCategories(!showCategories);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    return (
        <>
            <header className="main-header">
                <div className="header-container">
                    {/* Menu Button with a Distinct Class */}
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
                        <Link to="/login" className="icon-button">
                            <FontAwesomeIcon icon={faSignInAlt} />
                        </Link>
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
