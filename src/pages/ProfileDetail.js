import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert, Typography, Descriptions } from 'antd';

const { Title } = Typography;

const ProfileDetails = () => {
    const { customerId } = useParams(); // Get the customer ID from the URL
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8000/customer/${customerId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
            <div className="loading-container">
                <Spin size="large" tip="Loading customer details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="error-container">
                <Alert message="Error" description="Customer not found." type="error" showIcon />
            </div>
        );
    }

    return (
        <div className="profile-details-container">
            <Card bordered={false} style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
                    Customer Profile
                </Title>
                <Descriptions
                    bordered
                    layout="vertical"
                    column={1}
                    size="middle"
                    labelStyle={{ fontWeight: 'bold', width: '150px' }}
                >
                    <Descriptions.Item label="Name">{customer.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
                    <Descriptions.Item label="Tax ID">{customer.tax_id}</Descriptions.Item>
                    <Descriptions.Item label="Home Address">{customer.home_address}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};

export default ProfileDetails;
