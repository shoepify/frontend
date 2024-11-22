import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useUser } from "../context/UserContext"; // Import User Context
import "../styles/LoginPage.css"; // Import CSS

const LoginPage = () => {
    const [role, setRole] = useState(""); // Selected role
    const [formData, setFormData] = useState({}); // Login form data
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate(); // Initialize useNavigate
    const { setUserRole } = useUser(); // Destructure setUserRole from context

    const handleRoleChange = (e) => {
        setRole(e.target.value); // Update selected role
        setFormData({}); // Reset form data when role changes
        setError(null); // Clear previous errors
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Update form data
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission

        if (!role) {
            setError("Please select a role."); // Error if no role selected
            return;
        }

        const endpoint =
            role === "customer"
                ? "http://localhost:8000/login/customer/"
                : role === "sales_manager"
                ? "http://localhost:8000/login/sales_manager/"
                : "http://localhost:8000/login/product_manager/";

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        throw new Error(data.error || "Login failed");
                    });
                }
                return response.json();
            })
            .then((data) => {
                localStorage.setItem("accessToken", data.tokens.access);
                localStorage.setItem("refreshToken", data.tokens.refresh);
                localStorage.setItem("userId", data.user.id);
    
                setUserRole(role); // Update the global role
                navigate("/"); // Redirect after successful login
            })
            .catch((err) => setError(err.message)); // Handle errors
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">Welcome Back</h1>

                {!role ? (
                    <div className="role-selection">
                        <h2>Select Your Role</h2>
                        <select
                            value={role}
                            onChange={handleRoleChange}
                            className="role-dropdown"
                        >
                            <option value="">-- Select Role --</option>
                            <option value="customer">Customer</option>
                            <option value="sales_manager">Sales Manager</option>
                            <option value="product_manager">Product Manager</option>
                        </select>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        <button
                            type="button"
                            onClick={() => setRole("")}
                            className="change-role-button"
                        >
                            Change Role
                        </button>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ""}
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
                                value={formData.password || ""}
                                onChange={handleChange}
                                required
                                className="login-input"
                            />
                        </label>
                        <button type="submit" className="login-button">
                            Log In
                        </button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
