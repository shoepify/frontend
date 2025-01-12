import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Alert, Spin, Typography, Modal } from 'antd';

const { Title } = Typography;

const ProductManagerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingItems, setLoadingItems] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const [showOrderItems, setShowOrderItems] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8000/get_all_orders/')
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch orders');
                return response.json();
            })
            .then((data) => {
                setOrders(data.orders || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const fetchOrderItems = (orderId) => {
        setLoadingItems(true);
        fetch(`http://localhost:8000/get_order_items/${orderId}/`)
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch order items');
                return response.json();
            })
            .then((data) => {
                setOrderItems(data.order_items || []);
                setLoadingItems(false);
                setShowOrderItems(true);
            })
            .catch((err) => {
                setError(err.message);
                setLoadingItems(false);
            });
    };

    const updateOrderStatus = (orderId, newStatus) => {
        fetch(`http://localhost:8000/update_order_status/${orderId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to update order status');
                return response.json();
            })
            .then(() => {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.order_id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                alert(`Order ${orderId} status updated to ${newStatus}`);
            })
            .catch((err) => {
                alert('Error updating order status: ' + err.message);
            });
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'order_id',
            key: 'order_id',
        },
        {
            title: 'Customer ID', // New column for customer_id
            dataIndex: 'customer_id',
            key: 'customer_id',
        },
        {
            title: 'Delivery ID', // New column for delivery_id
            dataIndex: 'delivery_id',
            key: 'delivery_id',
        },
        {
            title: 'Order Date',
            dataIndex: 'order_date',
            key: 'order_date',
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (total_amount) => `$${parseFloat(total_amount).toFixed(2)}`,
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Address',
            dataIndex: 'customer_address',
            key: 'customer_address',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color;
                if (status === 'Processing') color = 'blue';
                else if (status === 'In-Transit') color = 'orange';
                else if (status === 'Delivered') color = 'green';
                else color = 'gray';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        size="small"
                        disabled={record.status === 'Processing'}
                        onClick={() => updateOrderStatus(record.order_id, 'Processing')}
                        style={{ marginRight: 8 }}
                    >
                        Processing
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        disabled={record.status === 'In-Transit'}
                        onClick={() => updateOrderStatus(record.order_id, 'In-Transit')}
                        style={{ marginRight: 8 }}
                    >
                        In-Transit
                    </Button>
                    <Button
                        type="success"
                        size="small"
                        disabled={record.status === 'Delivered'}
                        onClick={() => updateOrderStatus(record.order_id, 'Delivered')}
                    >
                        Delivered
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => fetchOrderItems(record.order_id)}
                    >
                        View Items
                    </Button>
                </>
            ),
        },
    ];

    if (loading) {
        return <Spin tip="Loading orders..." style={{ marginTop: '50px' }} />;
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ marginTop: '50px' }}
            />
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ marginBottom: '20px' }}>
                All Orders
            </Title>
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="order_id"
                bordered
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title={`Order Items`}
                visible={showOrderItems}
                onCancel={() => setShowOrderItems(false)}
                footer={null}
                width={600}
            >
                {loadingItems ? (
                    <Spin tip="Loading order items..." />
                ) : (
                    <Table
                        dataSource={orderItems}
                        columns={[
                            { title: 'Product ID', dataIndex: 'product_id', key: 'product_id' },
                            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                            {
                                title: 'Price Per Item',
                                dataIndex: 'price_per_item',
                                key: 'price_per_item',
                                render: (price) => `$${parseFloat(price).toFixed(2)}`,
                            },
                        ]}
                        rowKey="order_item_id"
                        pagination={false}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ProductManagerOrders;
