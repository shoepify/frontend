import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Card, Alert } from "antd";

const { Title, Text } = Typography;

const Profile = () => {
    const navigate = useNavigate();

    // Retrieve customerId from sessionStorage
    const customerId = sessionStorage.getItem("customerId");

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <Card bordered>
                <Title level={2} style={{ textAlign: "center" }}>
                    Profile Page
                </Title>
                <Text style={{ display: "block", textAlign: "center", marginBottom: "20px" }}>
                    Welcome to your profile! Here you can view and manage your personal information.
                </Text>
                <div style={{ textAlign: "center" }}>
                    {customerId ? (
                        <>
                            <Button
                                type="primary"
                                style={{ margin: "10px" }}
                                onClick={() => navigate(`/profile/${customerId}`)}
                            >
                                View Profile
                            </Button>
                            <Button
                                type="default"
                                style={{ margin: "10px" }}
                                onClick={() => navigate(`/orders/${customerId}`)}
                            >
                                View Orders
                            </Button>
                        </>
                    ) : (
                        <Alert
                            message="Access Denied"
                            description="Please log in to view your profile and orders."
                            type="warning"
                            showIcon
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Profile;
