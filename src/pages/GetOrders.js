import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Spin, Alert, Typography } from "antd";

const { Title } = Typography;

const GetOrders = () => {
    const { customerId } = useParams(); // Get customer ID from the URL
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/get_orders/${customerId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                return response.json();
            })
            .then((data) => {
                if (!data.orders || !Array.isArray(data.orders)) {
                    throw new Error("Invalid data format: 'orders' key is missing or not an array");
                }
                setOrders(data.orders);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Failed to load orders.");
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

    // Custom render for items
    const renderItems = (items) => {
        return items
            .map((item) => `${item.product_model} (x${item.quantity})`)
            .join(", ");
    };

    return (
        <div className="orders-container" style={{ padding: "20px" }}>
            <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
                Your Orders
            </Title>
            <Table
                dataSource={orders}
                columns={[
                    { title: "Order ID", dataIndex: "order_id", key: "order_id" },
                    { title: "Order Date", dataIndex: "order_date", key: "order_date" },
                    { title: "Total Amount", dataIndex: "total_amount", key: "total_amount" },
                    { title: "Discount", dataIndex: "discount_applied", key: "discount_applied" },
                    { title: "Payment Status", dataIndex: "payment_status", key: "payment_status" },
                    { title: "Order Status", dataIndex: "status", key: "status" },
                    {
                        title: "Items",
                        dataIndex: "items",
                        key: "items",
                        render: (items) => renderItems(items), // Custom render function for items
                    },
                ]}
                rowKey="order_id"
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default GetOrders;
