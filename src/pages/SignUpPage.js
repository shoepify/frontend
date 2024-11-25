import React, { useState } from "react";
import "../styles/SignUpPage.css"; // Import CSS

const SignupPage = () => {
    const [role, setRole] = useState(""); // Selected role
    const [formData, setFormData] = useState({}); // Form data
    const [error, setError] = useState(null); // Error state
    const [success, setSuccess] = useState(false); // Success state
    const [loading, setLoading] = useState(false); // Loading state

    // Role-specific endpoints
    const roleEndpoints = {
        customer: "http://localhost:8000/signup/customer/",
        sales_manager: "http://localhost:8000/signup/sales_manager/",
        product_manager: "http://localhost:8000/signup/product_manager/",
    };

    // Handle role change
    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setFormData({}); // Reset form data
        setError(null); // Clear errors
        setSuccess(false); // Clear success state
    };

    // Handle input changes
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
            const endpoint = roleEndpoints[role];
            if (!endpoint) throw new Error("Invalid role selected.");

            // Construct the payload
            let payload = {};
            if (role === "customer") {
                payload = {
                    user: {
                        email: formData.email,
                        password: formData.password,
                        role: "customer",
                    },
                    tax_id: formData.tax_id,
                    home_address: formData.home_address,
                };
            } else if (role === "sales_manager") {
                payload = {
                    user: {
                        email: formData.email,
                        password: formData.password,
                        role: "sales_manager",
                    },
                    region: formData.region,
                };
            } else if (role === "product_manager") {
                payload = {
                    user: {
                        email: formData.email,
                        password: formData.password,
                        role: "product_manager",
                    },
                    department: formData.department,
                };
            }

            // Send the signup request
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Signup failed");
            }

            const data = await response.json();

            // Store tokens and role in localStorage
            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("userEmail", data.email);
           

            setSuccess(true);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h1 className="signup-title">Create an Account</h1>

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
                    <>
                        {success ? (
                            <p className="success-message">
                                Signup successful! You can now log in.
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit} className="signup-form">
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
                                        className="signup-input"
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
                                        className="signup-input"
                                    />
                                </label>

                                {role === "customer" && (
                                    <>
                                        <label>
                                            Tax ID:
                                            <input
                                                type="text"
                                                name="tax_id"
                                                value={formData.tax_id || ""}
                                                onChange={handleChange}
                                                required
                                                className="signup-input"
                                            />
                                        </label>
                                        <label>
                                            Home Address:
                                            <input
                                                type="text"
                                                name="home_address"
                                                value={formData.home_address || ""}
                                                onChange={handleChange}
                                                required
                                                className="signup-input"
                                            />
                                        </label>
                                    </>
                                )}
                                {role === "sales_manager" && (
                                    <label>
                                        Region:
                                        <input
                                            type="text"
                                            name="region"
                                            value={formData.region || ""}
                                            onChange={handleChange}
                                            required
                                            className="signup-input"
                                        />
                                    </label>
                                )}
                                {role === "product_manager" && (
                                    <label>
                                        Department:
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department || ""}
                                            onChange={handleChange}
                                            required
                                            className="signup-input"
                                        />
                                    </label>
                                )}
                                <button
                                    type="submit"
                                    className="signup-button"
                                    disabled={loading}
                                >
                                    {loading ? "Signing up..." : "Sign Up"}
                                </button>
                            </form>
                        )}
                        {error && <p className="error-message">{error}</p>}
                    </>
                )}
            </div>
        </div>
    );
};

export default SignupPage;
