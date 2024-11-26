import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart, faBars } from "@fortawesome/free-solid-svg-icons";
import '../../styles/CustomerHeader.css';
import { useUser } from "../../context/UserContext";



const CustomerHeader = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { setUserRole } = useUser(); // Ensure this works

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
                    <Link to="/profile" className="header-button profile-button">
                        Profile
                    </Link>
                    <button onClick={handleLogout} className="header-button logout-button">
                        Logout
                    </button>
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

export default CustomerHeader;
