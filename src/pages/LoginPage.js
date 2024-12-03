import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Form, Input, Button, Select, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const LoginPage = () => {
    const [role, setRole] = useState("");
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setUserRole } = useUser();

    const handleRoleChange = (value) => {
        setRole(value);
        setFormData({});
        setError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        if (!role) {
            setError("Please select a role.");
            return;
        }

        const guestId = sessionStorage.getItem("guest_id");

        const endpoint =
            role === "customer"
                ? `http://127.0.0.1:8000/login/customer/${guestId ? `?guest_id=${guestId}` : ""}`
                : role === "sales_manager"
                ? "http://127.0.0.1:8000/login/sales_manager/"
                : "http://127.0.0.1:8000/login/product_manager/";

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
                sessionStorage.clear();

                const { refresh, access } = data.tokens;
                sessionStorage.setItem("accessToken", access);
                sessionStorage.setItem("refreshToken", refresh);

                if (role === "customer") {
                    sessionStorage.setItem("customerId", data.user.id);
                } else if (role === "product_manager") {
                    sessionStorage.setItem("productManagerId", data.user.manager_id);
                } else if (role === "sales_manager") {
                    sessionStorage.setItem("salesManagerId", data.user.manager_id);
                }

                setUserRole(role);
                navigate("/");
            })
            .catch((err) => {
                if (role === "customer") {
                    setError("Customer account not found. Please sign up.");
                } else {
                    setError(err.message);
                }
            });
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>Welcome Back</Title>

            {!role ? (
                <Form layout="vertical">
                    <Form.Item label="Select Your Role">
                        <Select
                            placeholder="-- Select Role --"
                            onChange={handleRoleChange}
                            value={role}
                        >
                            <Option value="customer">Customer</Option>
                            <Option value="sales_manager">Sales Manager</Option>
                            <Option value="product_manager">Product Manager</Option>
                        </Select>
                    </Form.Item>
                </Form>
            ) : (
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item>
                        <Button
                            type="link"
                            onClick={() => setRole("")}
                            style={{ marginBottom: 10 }}
                        >
                            Change Role
                        </Button>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter your email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                            name="password"
                            value={formData.password || ""}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            icon={<LoginOutlined />}
                        >
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
            )}

            <div style={{ textAlign: "center", marginTop: 20 }}>
                <p>
                    Don't have an account? <Link to="/signup">Sign Up Here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
