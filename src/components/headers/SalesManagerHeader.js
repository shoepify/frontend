import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Layout, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import '../../styles/SalesManagerHeader.css';
import { useUser } from "../../context/UserContext";

const { Header } = Layout;

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
            <div style={{ display: "flex", alignItems: "center" }}>
                <Button icon={<MenuOutlined />} style={{ marginRight: 15 }} />
                <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "bold", textDecoration: "none", color: "#000" }}>
                    Sales Manager
                </Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Button 
                    type="primary" 
                    onClick={() => navigate('/mydiscounts')} 
                    style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                    My Discounts
                </Button>
                <Button 
                    type="primary" 
                    onClick={() => navigate('/refunds')} 
                    style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                    Refunds
                </Button>
                <Button onClick={handleLogout} type="text" danger>
                    Logout
                </Button>
            </div>
        </Header>
    );
};

export default SalesManagerHeader;
