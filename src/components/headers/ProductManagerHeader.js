import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Button, Space, Typography } from "antd";
import {
    LogoutOutlined,
    AppstoreOutlined,
    CommentOutlined,
    OrderedListOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import "../../styles/ProductManagerHeader.css";
import { useUser } from "../../context/UserContext";

const { Header } = Layout;
const { Title } = Typography;

const ProductManagerHeader = () => {
    const navigate = useNavigate();
    const { setUserRole } = useUser();

    const handleLogout = async () => {
        try {
            sessionStorage.clear();
            setUserRole("guest");

            const response = await fetch("http://127.0.0.1:8000/");
            if (!response.ok) {
                throw new Error("Failed to fetch guest session data");
            }
            const data = await response.json();

            sessionStorage.setItem("guest_id", data.guest_id);
            sessionStorage.setItem("session_id", data.session_id);
            sessionStorage.setItem("created_at", data.created_at);

            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
            alert("An error occurred while logging out. Please try again.");
        }
    };

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
            {/* Left: Panel Title */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <Title level={3} style={{ margin: 0 }}>
                    Product Manager Panel
                </Title>
            </div>

            {/* Middle: Navigation Buttons */}
            <Space style={{ flex: 1, justifyContent: "center" }}>
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

            {/* Right: Logout Button */}
            <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ fontSize: "16px" }}
            >
                Logout
            </Button>
        </Header>
    );
};

export default ProductManagerHeader;
