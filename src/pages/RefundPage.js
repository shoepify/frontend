import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Typography, Button, message } from "antd";

const { Title } = Typography;

const RefundPage = () => {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch pending refunds
    useEffect(() => {
        fetch("http://localhost:8000/refunds/pending/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch pending refunds.");
                }
                return response.json();
            })
            .then((data) => {
                if (!data.pending_refunds || !Array.isArray(data.pending_refunds)) {
                    throw new Error("Invalid data format: 'pending_refunds' key is missing or not an array.");
                }
                setRefunds(data.pending_refunds);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Failed to load pending refunds.");
                setLoading(false);
            });
    }, []);

    // Handle refund approval
    const handleApproveRefund = (refundId) => {
        fetch(`http://localhost:8000/refund/approve/${refundId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    message.success("Refund approved successfully.");
                    // Remove approved refund from the list
                    setRefunds((prevRefunds) => prevRefunds.filter((refund) => refund.refund_id !== refundId));
                } else {
                    message.error(data.message || "Failed to approve refund.");
                }
            })
            .catch(() => {
                message.error("Failed to approve refund.");
            });
    };

    // Handle refund disapproval
    const handleDisapproveRefund = (refundId) => {
        fetch(`http://localhost:8000/disapprove_refund/${refundId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    message.success("Refund disapproved successfully.");
                    // Remove disapproved refund from the list
                    setRefunds((prevRefunds) => prevRefunds.filter((refund) => refund.refund_id !== refundId));
                } else {
                    message.error(data.message || "Failed to disapprove refund.");
                }
            })
            .catch(() => {
                message.error("Failed to disapprove refund.");
            });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading pending refunds..." />
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
        <div className="refunds-container" style={{ padding: "20px" }}>
            <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
                Pending Refunds
            </Title>
            <Table
                dataSource={refunds}
                columns={[
                    { title: "Refund ID", dataIndex: "refund_id", key: "refund_id" },
                    { title: "Order Item ID", dataIndex: "order_item_id", key: "order_item_id" },
                    { title: "Product Model", dataIndex: "product_model", key: "product_model" },
                    { title: "Customer Name", dataIndex: "customer_name", key: "customer_name" },
                    { title: "Order Date", dataIndex: "order_date", key: "order_date" },
                    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
                    { title: "Refund Amount", dataIndex: "refund_amount", key: "refund_amount" },
                    { title: "Request Date", dataIndex: "created_at", key: "created_at" },
                    {
                        title: "Actions",
                        key: "actions",
                        render: (_, record) => (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <Button
                                    type="primary"
                                    style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                                    onClick={() => handleApproveRefund(record.refund_id)}
                                >
                                    Approve Refund
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => handleDisapproveRefund(record.refund_id)}
                                >
                                    Disapprove Refund
                                </Button>
                            </div>
                        ),
                    },
                ]}
                rowKey="refund_id"
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default RefundPage;
