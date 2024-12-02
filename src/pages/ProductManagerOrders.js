import React, { useEffect, useState } from 'react';

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
                setOrders(data.orders || []); // Correctly extract the orders array
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error:', err.message);
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

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>All Orders</h1>
            <table border="1" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.order_id}>
                            <td>{order.order_id}</td>
                            <td>{order.order_date}</td>
                            <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                            <td>{order.customer_name}</td>
                            <td>{order.status}</td>
                            <td>
                                <button
                                    onClick={() => updateOrderStatus(order.order_id, 'Processing')}
                                    disabled={order.status === 'Processing'}
                                >
                                    Processing
                                </button>
                                <button
                                    onClick={() => updateOrderStatus(order.order_id, 'In-Transit')}
                                    disabled={order.status === 'In-Transit'}
                                >
                                    In-Transit
                                </button>
                                <button
                                    onClick={() => updateOrderStatus(order.order_id, 'Delivered')}
                                    disabled={order.status === 'Delivered'}
                                >
                                    Delivered
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManagerOrders;
