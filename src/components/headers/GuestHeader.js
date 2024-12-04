import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Input, Dropdown, Button } from "antd";
import { MenuOutlined, ShoppingCartOutlined, HeartOutlined, UserAddOutlined, LoginOutlined } from "@ant-design/icons";

const { Header } = Layout;

const HeaderComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const toggleCategories = () => setShowCategories(!showCategories);

    // Fetch categories from the backend
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
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <Dropdown overlay={menu} visible={showCategories} onVisibleChange={toggleCategories} trigger={["click"]}>
                    <Button icon={<MenuOutlined />} style={{ marginRight: 15 }} />
                </Dropdown>
                <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "bold", textDecoration: "none", color: "#000" }}>
                    My Bag Store
                </Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", flex: 1, marginLeft: 20 }}>
                <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", marginRight: 20, maxWidth: "50%" }}>
                    <Input
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        prefix={<HeartOutlined />}
                        style={{ width: "100%", marginRight: 10 }}
                    />
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                </form>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Link to="/cart">
                    <Button icon={<ShoppingCartOutlined />} type="text" />
                </Link>
                {!isLoggedIn ? (
                    <>
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
                    </>
                ) : (
                    <Button onClick={() => setIsLoggedIn(false)} type="text" danger>
                        Logout
                    </Button>
                )}
            </div>
        </Header>
    );
};

export default HeaderComponent;
