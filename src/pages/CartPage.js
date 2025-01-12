import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal, Image, Typography, Alert, Spin, Card, Form, Input, DatePicker } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import InvoiceViewer from "../components/InvoiceViewer"; // Import InvoiceViewer component
import moment from "moment";

const { Title } = Typography;

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [invoiceModalVisible, setInvoiceModalVisible] = useState(false); // For invoice modal visibility
    const [invoiceUrl, setInvoiceUrl] = useState(""); // To store the invoice URL for the modal
    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        const guestId = sessionStorage.getItem("guest_id");
        const customerId = sessionStorage.getItem("customerId");

        let url;

        if (customerId) {
            setUserId(customerId);
            url = `http://localhost:8000/cart_customer/${customerId}/`;
            setIsGuest(false);
        } else if (guestId) {
            setUserId(guestId);
            url = `http://localhost:8000/cart_guest/${guestId}/`;
            setIsGuest(true);
        } else {
            setError("Unable to determine user type for viewing the cart.");
            setLoading(false);
            return;
        }

        fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch cart data");
                return response.json();
            })
            .then((data) => {
                const cartItems = data.cart_items || [];
                return Promise.all(
                    cartItems.map((item) => {
                        const productId = item.product_id;

                        return fetch(`http://localhost:8000/products/${productId}/`)
                            .then((response) => {
                                if (!response.ok)
                                    throw new Error(`Failed to fetch product data for product_id: ${productId}`);
                                return response.json();
                            })
                            .then((productData) => ({
                                ...productData,
                                product_quantity: item.quantity,
                                total_price: item.quantity * productData.price,
                            }));
                    })
                );
            })
            .then((products) => {
                setCartItems(products);
                setTotalPrice(products.reduce((sum, item) => sum + item.total_price, 0));
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleRemoveFromCart = (productId) => {
        const guestId = sessionStorage.getItem("guest_id");
        const customerId = sessionStorage.getItem("customerId");

        let url;

        if (customerId) {
            url = `http://127.0.0.1:8000/customer/${customerId}/remove/${productId}/`;
        } else if (guestId) {
            url = `http://127.0.0.1:8000/guest/${guestId}/remove/${productId}/`;
        } else {
            alert("Unable to determine user type for removing the product.");
            return;
        }

        fetch(url, { method: "DELETE" })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to remove item from cart");
                setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
                setTotalPrice((prevTotal) =>
                    prevTotal - cartItems.find((item) => item.product_id === productId).total_price
                );
            })
            .catch((error) => {
                console.error(error.message);
                alert("Error removing item from cart: " + error.message);
            });
    };

    const handleProceedToPayment = () => {
        if (isGuest) {
            alert("You need to sign up or log in to complete the payment.");
            navigate("/login");
            return;
        }
        setPaymentModalVisible(true);
    };

    const handleConfirmPayment = () => {
        form.validateFields()
            .then((values) => {
                console.log("Credit Card Info:", values);

                fetch(`http://127.0.0.1:8000/order/place/${userId}/`, { method: "POST" })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            alert(`Order placed successfully! Order ID: ${data.order_id}`);

                            // Generate the invoice URL using invoice_id
                            const invoiceId = data.invoice_id;  // Use the invoice_id returned in the response
                            
                            // Generate the invoice URL based on invoice_id
                            const invoiceUrl = `http://localhost:8000/invoice/${invoiceId}/create-pdf-ozan/`;

                            // Set the URL for the InvoiceViewer modal
                            setInvoiceUrl(invoiceUrl);
                            setInvoiceModalVisible(true);  // Open the Invoice modal to show the PDF
                        }
                    })
                    .catch((error) => {
                        console.error("Error placing order:", error);
                        alert("Error placing order.");
                    });
            })
            .catch((error) => {
                console.error("Validation failed:", error);
            });
    };

    const closeInvoiceModal = () => {
        setInvoiceModalVisible(false);
    };

    const validateCardName = (_, value) => {
        if (!value || /^[a-zA-Z\s]+$/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Name should only contain letters and spaces."));
    };

    const validateCardNumber = (_, value) => {
        if (!value || /^[0-9]{16}$/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Card number must be 16 digits."));
    };

    const validateCVV = (_, value) => {
        if (!value || /^[0-9]{3}$/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("CVV must be 3 digits."));
    };

    const validateExpiryDate = (_, value) => {
        if (!value || value.isAfter(moment())) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Expiry date must be a future date."));
    };

    const columns = [
        {
            title: "Product",
            dataIndex: "model",
            key: "model",
        },
        {
            title: "Image",
            dataIndex: "image_name",
            key: "image_name",
            render: (imageName) => (
                <Image
                    src={`/images/${imageName}`}
                    alt={imageName}
                    width={50}
                    fallback="https://via.placeholder.com/50"
                />
            ),
        },
        {
            title: "Quantity",
            dataIndex: "product_quantity",
            key: "product_quantity",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${Number(price).toFixed(2)}`,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveFromCart(record.product_id)}
                >
                    Remove
                </Button>
            ),
        },
    ];

    if (loading) return <Spin tip="Loading cart items..." />;
    if (error) return <Alert message="Error" description={error} type="error" showIcon />;

    return (
        <Card style={{ margin: "20px", padding: "20px" }}>
            <Title level={2}>
                <ShoppingCartOutlined /> Your Cart
            </Title>
            <Table
                dataSource={cartItems}
                columns={columns}
                rowKey="product_id"
                pagination={false}
                style={{ marginBottom: "20px" }}
            />
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <Title level={4}>Total: ${totalPrice.toFixed(2)}</Title>
            </div>
            <Button type="primary" onClick={handleProceedToPayment}>
                Proceed to Payment
            </Button>
            <Modal
                visible={paymentModalVisible}
                onOk={handleConfirmPayment}
                onCancel={() => setPaymentModalVisible(false)}
                title="Enter Payment Details"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="cardNumber"
                        label="Card Number"
                        rules={[{ required: true, validator: validateCardNumber }]}
                    >
                        <Input placeholder="1234 5678 1234 5678" />
                    </Form.Item>
                    <Form.Item
                        name="cardName"
                        label="Card Holder Name"
                        rules={[{ required: true, validator: validateCardName }]}
                    >
                        <Input placeholder="John Doe" />
                    </Form.Item>
                    <Form.Item
                        name="expiryDate"
                        label="Expiry Date"
                        rules={[{ required: true, validator: validateExpiryDate }]}
                    >
                        <DatePicker
                            picker="month"
                            format="MM/YY"
                            placeholder="MM/YY"
                            disabledDate={(current) => current && current < moment().endOf("month")}
                        />
                    </Form.Item>
                    <Form.Item
                        name="cvv"
                        label="CVV"
                        rules={[{ required: true, validator: validateCVV }]}
                    >
                        <Input placeholder="123" type="password" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* InvoiceViewer modal */}
            <InvoiceViewer 
                visible={invoiceModalVisible} 
                onCancel={closeInvoiceModal} 
                invoiceUrl={invoiceUrl} 
            />
        </Card>
    );
};

export default Cart;

