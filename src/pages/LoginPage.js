import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import User Context
import "../styles/LoginPage.css"; // Import CSS

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" }); // Login form data
    const [error, setError] = useState(null); // Error state
    const [loading, setLoading] = useState(false); // Loading state
    const { setUserRole } = useUser(); // Destructure setUserRole from context

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        setLoading(true); // Set loading state

        try {
            const response = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData), // Send email and password
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Login failed");
            }

            const data = await response.json();

            // Store tokens securely
            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userRole", data.role); // "sales_manager"

            // Update global role from backend response
            setUserRole(data.role);
            console.log(`Logged in as: ${data.role}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">Welcome Back</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="login-input"
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="login-input"
                        />
                    </label>
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
