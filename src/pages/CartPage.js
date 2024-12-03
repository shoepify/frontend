import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal, Image, Typography, Alert, Spin, Card } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [mockPaymentVisible, setMockPaymentVisible] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const navigate = useNavigate();

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

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch cart data");
                return response.json();
            })
            .then((data) => {
                const cartItems = data.cart_items || [];
                return Promise.all(
                    cartItems.map((item) => {
                        const productId = item.product_id;

                        return fetch(`http://localhost:8000/products/${productId}/`, {
                            method: "GET",
                            headers: { "Content-Type": "application/json" },
                        })
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

        fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
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
        fetch(`http://127.0.0.1:8000/check_cart/${userId}/`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    setMockPaymentVisible(true);
                }
            })
            .catch((error) => {
                console.error("Error checking cart:", error);
                alert("Error checking cart.");
            });
    };

    const handleConfirmPayment = () => {
        if (isGuest) {
            alert("You need to sign up or log in to complete the payment.");
            navigate("/login");
            return;
        }

        fetch(`http://127.0.0.1:8000/order/place/${userId}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(`Order placed successfully! Order ID: ${data.order_id}`);

                    const invoiceUrl = `http://localhost:8000/invoice/${data.order_id}/create-pdf/`;
                    window.open(invoiceUrl, "_blank");
                }
                setMockPaymentVisible(false);
            })
            .catch((error) => {
                console.error("Error placing order:", error);
                alert("Error placing order.");
            });
    };

    const columns = [
        {
            title: "Product",
            dataIndex: "model",
            key: "model",
        },
        {
            title: "Image",
            dataIndex: "image_url",
            key: "image_url",
            render: (text) => <Image src={text || "https://via.placeholder.com/150"} width={50} />,
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
                visible={mockPaymentVisible}
                onOk={handleConfirmPayment}
                onCancel={() => setMockPaymentVisible(false)}
                title="Confirm Payment"
            >
                <p>Do you want to confirm the payment?</p>
            </Modal>
        </Card>
    );
};

export default Cart;
