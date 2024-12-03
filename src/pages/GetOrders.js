import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Spin, Alert, Typography, Button, Modal } from "antd";
import OrderProductCard from "../components/OrderProductCard";

const { Title } = Typography;

const GetOrders = () => {
    const { customerId } = useParams(); // Get customer ID from the URL
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    // Handle viewing products in a modal
    const handleViewProducts = (items) => {
        setSelectedOrderItems(items);
        setIsModalVisible(true);
    };

    // Handle viewing invoice
    const handleViewInvoice = (invoiceId) => {
        const url = `http://localhost:8000/invoice/${invoiceId}/create-pdf-ozan/`;
        window.open(url, "_blank"); // Open the invoice URL in a new tab
    };

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
                    { title: "Purchase Status", dataIndex: "payment_status", key: "payment_status" },
                    { title: "Delivery Status", dataIndex: "status", key: "status" },
                    {
                        title: "Actions",
                        key: "actions",
                        render: (_, record) => (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <Button
                                    type="primary"
                                    onClick={() => handleViewProducts(record.items)}
                                >
                                    View Products
                                </Button>
                                <Button
                                    type="default"
                                    onClick={() => handleViewInvoice(record.order_id)}
                                >
                                    View Invoice
                                </Button>
                            </div>
                        ),
                    },
                ]}
                rowKey="order_id"
                pagination={{ pageSize: 5 }}
            />

            {/* Modal for viewing products */}
            <Modal
                title="Order Products"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedOrderItems.map((item) => (
                    <OrderProductCard key={item.product_id} product={item} />
                ))}
            </Modal>
        </div>
    );
};

export default GetOrders;