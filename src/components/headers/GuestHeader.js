import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Input, Dropdown, Button, Space } from "antd";
import {
    SearchOutlined,
    ShoppingCartOutlined,
    MenuOutlined,
    PhoneOutlined,
    FacebookOutlined,
    InstagramOutlined,
    UserAddOutlined,
    LoginOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const GuestHeader = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const toggleCategories = () => setShowCategories(!showCategories);

    useEffect(() => {
        fetch("http://localhost:8000/products/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }
                return response.json();
            })
            .then((data) => {
                const uniqueCategories = [...new Set(data.map((product) => product.category))];
                setCategories(uniqueCategories);
            })
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`);
        }
    };

    const menu = (
        <Menu>
            {categories.map((category, index) => (
                <Menu.Item key={index}>
                    <Link to={`/categories/${encodeURIComponent(category)}`}>{category}</Link>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                padding: "10px 20px",
                position: "relative",
            }}
        >
            {/* Logo Section */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <Dropdown overlay={menu} visible={showCategories} onVisibleChange={toggleCategories} trigger={["click"]}>
                    <Button icon={<MenuOutlined />} style={{ marginRight: 15 }} />
                </Dropdown>
                <Link to="/">
                    <img
                        src="/images/logo1.jpg"
                        alt="Bag Store Logo"
                        style={{ height: "80px", objectFit: "contain" }} // Enlarged logo size
                    />
                </Link>
            </div>

            {/* Search Bar */}
            <div style={{ flex: 1, marginLeft: 20, marginRight: 20 }}>
                <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center" }}>
                    <Input
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            borderRadius: "15px",
                            border: "1px solid #ccc",
                            padding: "5px 10px",
                            flex: 1,
                            marginRight: "10px",
                            maxWidth: "300px", // Compact search bar width
                        }}
                        prefix={<SearchOutlined />}
                    />
                    <Button type="primary" htmlType="submit" style={{ borderRadius: "15px" }}>
                        Search
                    </Button>
                </form>
            </div>

            {/* Contact, Language, Social Media, and Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {/* Phone Number */}
                <Space style={{ marginRight: 20, fontSize: "16px" }}>
                    <PhoneOutlined />
                    <span>+123 456 789</span>
                </Space>

                {/* Language Selector (No translation functionality) */}
                <Space>
                    <Button type="link" style={{ padding: "0 10px", fontSize: "16px" }}>
                        TR
                    </Button>
                    <Button type="link" style={{ padding: "0 10px", fontSize: "16px" }}>
                        EN
                    </Button>
                    <Button type="link" style={{ padding: "0 10px", fontSize: "16px" }}>
                        FR
                    </Button>
                </Space>

                {/* Social Media */}
                <Space>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FacebookOutlined style={{ fontSize: "20px", color: "#3b5998" }} />
                    </a>
                    <a href="https://www.instagram.com/mert_ulu/" target="_blank" rel="noopener noreferrer">
                        <InstagramOutlined style={{ fontSize: "20px", color: "#C13584" }} />
                    </a>
                </Space>

                {/* Cart */}
                <Link to="/cart">
                    <Button icon={<ShoppingCartOutlined />} type="text" />
                </Link>

                {/* Login and Sign Up */}
                <Space>
                    <Link to="/signup">
                        <Button icon={<UserAddOutlined />} type="text">
                            Sign Up
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button icon={<LoginOutlined />} type="text">
                            Login
                        </Button>
                    </Link>
                </Space>
            </div>
        </Header>
    );
};

export default GuestHeader;
