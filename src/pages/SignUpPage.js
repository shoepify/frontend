import React, { useState } from "react";

const SignupPage = () => {
    const [role, setRole] = useState(""); // Selected role
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setFormData({}); // Reset form data when role changes
        setError(null); // Clear any previous errors
        setSuccess(false); // Clear success message
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const endpoint =
            role === "customer"
                ? "http://localhost:8000/signup/customer/"
                : role === "sales_manager"
                ? "http://localhost:8000/signup/sales_manager/"
                : "http://localhost:8000/signup/product_manager/";

        fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        throw new Error(data.error || "Signup failed");
                    });
                }
                return response.json();
            })
            .then(() => {
                setSuccess(true);
                setError(null);
            })
            .catch((err) => setError(err.message));
    };

    return (
        <div className="signup-page">
            <h1>Sign Up</h1>

            {!role ? (
                <div className="role-selection">
                    <h2>Select your role</h2>
                    <select value={role} onChange={handleRoleChange}>
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
                            <button type="button" onClick={() => setRole("")}>
                                Change Role
                            </button>
                            {role === "customer" && (
                                <>
                                    <label>
                                        Name:
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Tax ID:
                                        <input
                                            type="text"
                                            name="tax_id"
                                            value={formData.tax_id || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Email:
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ""}
                                            onChange={handleChange}
                                            required
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
                                        />
                                    </label>
                                </>
                            )}
                            {(role === "sales_manager" ||
                                role === "product_manager") && (
                                <>
                                    <label>
                                        Name:
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Email:
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ""}
                                            onChange={handleChange}
                                            required
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
                                        />
                                    </label>
                                </>
                            )}
                            <button type="submit">Sign Up</button>
                        </form>
                    )}
                    {error && <p className="error-message">{error}</p>}
                </>
            )}
        </div>
    );
};

export default SignupPage;
