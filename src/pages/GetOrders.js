import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Spin, Alert, Typography, Button, Modal, message } from "antd";
import OrderProductCard from "../components/OrderProductCard";
import InvoiceViewer from "../components/InvoiceViewer";  // Import InvoiceViewer component

const { Title } = Typography;

const GetOrders = () => {
    const { customerId } = useParams(); // Get customer ID from the URL
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [isProductModalVisible, setIsProductModalVisible] = useState(false); // For product modal
    const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false); // For invoice modal
    const [invoiceId, setInvoiceId] = useState(null); // To manage which invoice to show

    useEffect(() => {
        fetch(`http://localhost:8000/get_orders/${customerId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                    setOrders([]);
                    setLoading(false);
                } else {
                    setOrders(data.orders || []);
                    setLoading(false);
                }
            })
            .catch((err) => {
                setError("Failed to fetch orders.");
                setLoading(false);
            });
    }, [customerId]);

    const handleViewProducts = (orderItems) => {
        setSelectedOrderItems(orderItems); // Set the selected order items
        setIsProductModalVisible(true); // Open the product modal
    };

    const handleViewInvoice = (invoiceId) => {
        setInvoiceId(invoiceId); // Set the invoice ID
        setIsInvoiceModalVisible(true); // Open the invoice modal
    };

    const handleRefundRequest = (orderItemId) => {
        fetch(`http://localhost:8000/refund/request/${orderItemId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to submit refund request.");
                }
                return response.json();
            })
            .then((data) => {
                if (data.status === "success") {
                    message.success(`${data.message} (Refund ID: ${data.refund_id})`);
                } else {
                    message.error(data.message || "Refund request failed.");
                }
            })
            .catch(() => {
                message.error("Failed to submit refund request.");
            });
    };

    const handleCancelOrder = (orderId) => {
        Modal.confirm({
            title: "Are you sure you want to cancel this order?",
            content: "This action cannot be undone.",
            okText: "Yes, Cancel",
            cancelText: "No",
            onOk: () => {
                fetch(`http://localhost:8000/order/cancel/${orderId}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to cancel order.");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        message.success(data.message || "Order successfully cancelled.");
                        setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
                    })
                    .catch(() => {
                        message.error("Failed to cancel order.");
                    });
            },
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading orders..." />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="info-container">
                <Alert
                    message="No Orders"
                    description="You have no orders yet."
                    type="info"
                    showIcon
                />
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
                                <Button type="primary" onClick={() => handleViewProducts(record.order_items)}>
                                    View Products
                                </Button>
                                <Button type="default" onClick={() => handleViewInvoice(record.order_id)}>
                                    View Invoice
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    style={{
                                        backgroundColor: "#ff4d4f",
                                        borderColor: "#ff4d4f",
                                        color: "#fff",
                                        fontWeight: "bold",
                                    }}
                                    onClick={() => handleRefundRequest(record.order_id)}
                                >
                                    Request Refund
                                </Button>
                                <Button
                                    type="default"
                                    danger
                                    onClick={() => handleCancelOrder(record.order_id)}
                                >
                                    Cancel Order
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
                visible={isProductModalVisible}
                onCancel={() => setIsProductModalVisible(false)}
                footer={null}
            >
                {selectedOrderItems.length === 0 ? (
                    <p>No products selected.</p>
                ) : (
                    selectedOrderItems.map((item) => (
                        <OrderProductCard key={item.product_id} product={item} />
                    ))
                )}
            </Modal>

            {/* Invoice Viewer Modal */}
            {invoiceId && (
                <InvoiceViewer
                    invoiceId={invoiceId}
                    visible={isInvoiceModalVisible}
                    onCancel={() => setIsInvoiceModalVisible(false)}
                />
            )}
        </div>
    );
};

export default GetOrders;
