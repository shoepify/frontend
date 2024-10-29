

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';

const Header = () => {
    const [showLogin, setShowLogin] = useState(false);

    const handleLoginClick = () => {
        setShowLogin(true);  // Show the login modal
    };

    const closeLoginModal = () => {
        setShowLogin(false);  // Close the login modal
    };

    return (
        <header className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link to="/" className="navbar-brand">My Shoe Store</Link>

                <div className="ms-auto d-flex align-items-center">
                    {/* Favorites Link */}
                    <Link to="/favorites" className="btn btn-outline-secondary me-3">
                        Favorites
                    </Link>

                    {/* Login Button */}
                    <button className="btn btn-outline-primary" onClick={handleLoginClick}>Login</button>
                </div>
            </div>

            {/* Login Modal */}
            {showLogin && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={closeLoginModal} className="close-button">X</button>
                        <LoginForm onClose={closeLoginModal} />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
