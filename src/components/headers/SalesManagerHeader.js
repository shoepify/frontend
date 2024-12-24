import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button, Space, Typography } from "antd";
import { useUser } from "../../context/UserContext";

const { Header } = Layout;
const { Title } = Typography;

const SalesManagerHeader = () => {
    const navigate = useNavigate();
    const { setUserRole } = useUser();

    const handleLogout = () => {
        sessionStorage.clear();
        setUserRole("guest");

        fetch("http://127.0.0.1:8000/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch guest info");
                }
                return response.json();
            })
            .then((data) => {
                sessionStorage.setItem("guest_id", data.guest_id);
                sessionStorage.setItem("session_id", data.session_id);
                sessionStorage.setItem("created_at", data.created_at);
                navigate("/");
            })
            .catch((error) => {
                console.error("Error fetching guest info:", error);
            });
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
            {/* Sol Taraf: Başlık */}
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <Title
                    level={3}
                    style={{ margin: 0 }}
                    onClick={() => navigate("/sales-manager-home")} // Redirect to SalesManagerHome
                >
                    Sales Manager Panel
                </Title>
            </div>

            {/* Orta Kısım: Navigasyon Butonları */}
            <Space style={{ flex: 1, justifyContent: "center" }}>
                <Button
                    type="text"
                    onClick={() => navigate("/sales-dashboard")}
                    style={{ fontSize: "16px" }}
                >
                    Dashboard
                </Button>
                <Button
                    type="text"
                    onClick={() => navigate("/mydiscounts")}
                    style={{ fontSize: "16px" }}
                >
                    Discounts
                </Button>
                <Button
                    type="text"
                    onClick={() => navigate("/refunds")}
                    style={{ fontSize: "16px" }}
                >
                    Refunds
                </Button>
            </Space>

            {/* Sağ Taraf: Logout Butonu */}
            <Button
                onClick={handleLogout}
                type="text"
                danger
                style={{ fontSize: "16px" }}
            >
                Logout
            </Button>
        </Header>
    );
};

export default SalesManagerHeader;
