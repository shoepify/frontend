import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Alert, Typography, Descriptions } from "antd";
import { UserOutlined, MailOutlined, IdcardOutlined, HomeOutlined, DollarCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ProfileDetails = () => {
    const { customerId } = useParams(); // Get the customer ID from the URL
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8000/customer/${customerId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch customer details. Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setCustomer(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [customerId]);

    if (loading) {
        return (
            <div className="loading-container" style={{ textAlign: "center", marginTop: "50px" }}>
                <Spin size="large" tip="Loading customer details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="error-container" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
                <Alert message="Error" description="Customer not found." type="error" showIcon />
            </div>
        );
    }

    return (
        <div className="profile-details-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <Card bordered style={{ padding: "20px" }}>
                <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
                    <UserOutlined /> Customer Profile
                </Title>
                <Descriptions
                    bordered
                    layout="vertical"
                    column={1}
                    size="middle"
                    labelStyle={{ fontWeight: "bold", width: "150px" }}
                >
                    <Descriptions.Item label={<span><UserOutlined /> Name</span>}>
                        {customer.name}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span><MailOutlined /> Email</span>}>
                        {customer.email}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span><IdcardOutlined /> Tax ID</span>}>
                        {customer.tax_id}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span><HomeOutlined /> Home Address</span>}>
                        {customer.address}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span><DollarCircleOutlined /> Balance</span>}>
                        ${parseFloat(customer.balance).toFixed(2)}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};

export default ProfileDetails;
