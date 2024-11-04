// pages/LoginPage.js

import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);  // Toggle between login and sign-up modes
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Customer');  // Default role

    // Toggle between Login and Sign Up
    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
        setUsername('');
        setPassword('');
        setEmail('');
        setRole('Customer');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignUp) {
            console.log("Signing up:", { username, password, email, role });
            // Add sign-up logic here
        } else {
            console.log("Logging in:", { username, password });
            // Add login logic here
        }
    };

    return (
        <div className="login-container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Email field for Sign Up */}
                        {isSignUp && (
                            <div className="form-group mb-3">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Role selection for Sign Up */}
                        {isSignUp && (
                            <div className="form-group mb-3">
                                <label>Select Role</label>
                                <select
                                    className="form-control"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Sales Manager">Sales Manager</option>
                                    <option value="Product Manager">Product Manager</option>
                                </select>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary w-100">
                            {isSignUp ? 'Sign Up' : 'Login'}
                        </button>
                    </form>

                    {/* Toggle button between Login and Sign Up */}
                    <p className="text-center mt-3">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button onClick={toggleSignUp} className="btn btn-link">
                            {isSignUp ? 'Login' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

