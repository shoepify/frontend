import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Alert, Spin, Typography } from 'antd';

const { Title } = Typography;

const ProductManagerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        </div>
    );
};

export default ProductManagerOrders;
