import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Spin, Alert, Typography } from 'antd';

const { Title } = Typography;

const GetOrders = () => {
    const { customerId } = useParams(); // Get customer ID from the URL
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/get_orders/${customerId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                return response.json();
            })
            .then((data) => {
                setOrders(data);
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
                <Spin size="large" tip="Loading orders..." />
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

    return (
        <div className="orders-container" style={{ padding: '20px' }}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
                Your Orders
            </Title>
            <Table
                dataSource={orders}
                columns={[
                    { title: 'Order ID', dataIndex: 'order_id', key: 'order_id' },
                    { title: 'Product Name', dataIndex: 'product_name', key: 'product_name' },
                    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                    { title: 'Total Price', dataIndex: 'total_price', key: 'total_price' },
                    { title: 'Status', dataIndex: 'status', key: 'status' },
                    { title: 'Order Date', dataIndex: 'order_date', key: 'order_date' },
                ]}
                rowKey="order_id"
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default GetOrders;
