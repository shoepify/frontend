import React, { useEffect, useState } from 'react';

const ProductManagerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoiceUrl, setInvoiceUrl] = useState('');

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

    const viewInvoice = (invoiceId) => {
        const pdfUrl = `http://localhost:8000/invoice/${invoiceId}/create-pdf/`;
        setInvoiceUrl(pdfUrl);
        setShowInvoice(true);
    };

    const closeInvoicePopup = () => {
        setInvoiceUrl('');
        setShowInvoice(false);
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
                        <th>Invoice</th>
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
                            <td>
                                <button onClick={() => viewInvoice(order.order_id)}>View Invoice</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for Invoice */}
            {showInvoice && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '5px',
                            width: '80%',
                            height: '80%',
                            position: 'relative',
                        }}
                    >
                        <button
                            onClick={closeInvoicePopup}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                            }}
                        >
                            Close
                        </button>
                        <object
                            data={invoiceUrl}
                            type="application/pdf"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                            }}
                        >
                            <p>
                                It appears your browser does not support PDF viewing. You can{' '}
                                <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
                                    download the invoice
                                </a>
                                .
                            </p>
                        </object>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagerOrders;
