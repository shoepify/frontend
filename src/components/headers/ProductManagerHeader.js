import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Space } from "antd";
import { LogoutOutlined, AppstoreOutlined, ShoppingCartOutlined, CommentOutlined, OrderedListOutlined, SettingOutlined } from "@ant-design/icons";
import "../../styles/ProductManagerHeader.css";
import { useUser } from "../../context/UserContext";

const ProductManagerHeader = () => {
    const navigate = useNavigate();
    const { setUserRole } = useUser();

    const handleLogout = async () => {
        try {
            // Clear user-specific session data
            sessionStorage.clear();

            // Reset the user role to "guest"
            setUserRole("guest");

            // Fetch new guest session details
            const response = await fetch("http://127.0.0.1:8000/");
            if (!response.ok) {
                throw new Error("Failed to fetch guest session data");
            }
            const data = await response.json();

            // Store new guest session details in sessionStorage
            sessionStorage.setItem("guest_id", data.guest_id);
            sessionStorage.setItem("session_id", data.session_id);
            sessionStorage.setItem("created_at", data.created_at);

            // Navigate to the homepage
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
            alert("An error occurred while logging out. Please try again.");
        }
    };

    return (
        <header className="product-manager-header">
            <div className="header-container">
                {/* Logo */}
                <Link to="/" className="logo">
                    Store
                </Link>

                {/* Navigation Links */}
                <nav className="nav-buttons">
                    <Space size="middle">
                        <Link to="/comments">
                            <Button type="text" icon={<CommentOutlined />}>
                                Comments
                            </Button>
                        </Link>
                        <Link to="/manage-products">
                            <Button type="text" icon={<AppstoreOutlined />}>
                                Products
                            </Button>
                        </Link>
                        <Link to="/manage-products/add">
                            <Button type="text" icon={<AppstoreOutlined />}>
                                Add Product
                            </Button>
                        </Link>
                        <Link to="/product_manager/orders">
                            <Button type="text" icon={<OrderedListOutlined />}>
                                Orders
                            </Button>
                        </Link>
                        <Link to="/manage_categories">
                            <Button type="text" icon={<SettingOutlined />}>
                                Categories
                            </Button>
                        </Link>
                    </Space>
                </nav>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default ProductManagerHeader;
