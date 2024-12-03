import React, { useState } from "react";
import { Form, Input, Button, Select, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined, IdcardOutlined, MailOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const SignupPage = () => {
    const [role, setRole] = useState(""); // Selected role
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleRoleChange = (value) => {
        setRole(value);
        setFormData({});
        setError(null);
        setSuccess(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
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
        <div style={{ maxWidth: 500, margin: "50px auto", padding: 20, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>Create an Account</Title>

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
                <>
                    {success ? (
                        <Alert message="Signup successful! You can now log in." type="success" showIcon style={{ marginBottom: 20 }} />
                    ) : (
                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Button type="link" onClick={() => setRole("")} style={{ marginBottom: 10 }}>
                                Change Role
                            </Button>

                            {role === "customer" && (
                                <>
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        rules={[{ required: true, message: "Please input your name!" }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Enter your name"
                                            name="name"
                                            value={formData.name || ""}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Tax ID"
                                        name="tax_id"
                                        rules={[{ required: true, message: "Please input your tax ID!" }]}
                                    >
                                        <Input
                                            prefix={<IdcardOutlined />}
                                            placeholder="Enter your tax ID"
                                            name="tax_id"
                                            value={formData.tax_id || ""}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
                                    >
                                        <Input
                                            prefix={<MailOutlined />}
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
                                    <Form.Item
                                        label="Home Address"
                                        name="home_address"
                                        rules={[{ required: true, message: "Please input your home address!" }]}
                                    >
                                        <Input
                                            prefix={<HomeOutlined />}
                                            placeholder="Enter your home address"
                                            name="home_address"
                                            value={formData.home_address || ""}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </>
                            )}

                            {(role === "sales_manager" || role === "product_manager") && (
                                <>
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        rules={[{ required: true, message: "Please input your name!" }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Enter your name"
                                            name="name"
                                            value={formData.name || ""}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
                                    >
                                        <Input
                                            prefix={<MailOutlined />}
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
                                </>
                            )}

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Sign Up
                                </Button>
                            </Form.Item>
                        </Form>
                    )}

                    {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}
                </>
            )}
        </div>
    );
};

export default SignupPage;
