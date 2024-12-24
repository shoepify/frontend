import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, Image, Alert, Spin, Row, Col, Space, Button, Divider, InputNumber } from 'antd';
import {
    BarcodeOutlined,
    InboxOutlined,
    SafetyCertificateOutlined,
    IdcardOutlined,
    ShopOutlined,
    FileTextOutlined,
    DollarOutlined,
    TagOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import ApprovedComments from './ApprovedComments';

const { Title, Text } = Typography;

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetch(`http://localhost:8000/products/${productId}/`)
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch product details');
                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [productId]);

    const handleAddToCart = () => {
        const guestId = sessionStorage.getItem("guest_id");
        const customerId = sessionStorage.getItem("customerId");

        let url;

        if (customerId) {
            url = `http://localhost:8000/add_to_cart_customer/${customerId}/${product.product_id}/${quantity}/`;
        } else if (guestId) {
            url = `http://localhost:8000/add_to_cart_guest/${guestId}/${product.product_id}/${quantity}/`;
        } else {
            alert("Please login to add items to the cart.");
            return;
        }

        fetch(url, { method: "POST" })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to add to cart");
                return response.json();
            })
            .then(() => alert("Product added to cart successfully!"))
            .catch(() => alert("Error adding product to cart."));
    };

    const handleAddToFavorites = () => {
        const customerId = sessionStorage.getItem("customerId");

        if (!customerId) {
            alert("Please login to add items to favorites.");
            return;
        }

        const url = `http://localhost:8000/wishlist/${customerId}/add/${product.product_id}/`;

        fetch(url, { method: "POST" })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to add to favorites");
                return response.json();
            })
            .then(() => alert("Product added to favorites successfully!"))
            .catch(() => alert("Error adding product to favorites."));
    };

    if (loading) {
        return <Spin tip="Loading product details..." style={{ marginTop: 50 }} />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: 50 }} />;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            {product && (
                <Card bordered style={{ padding: '20px' }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Image
                                src={`/images/${product.image_name}`}
                                alt={product.model}
                                width="100%"
                                fallback="https://via.placeholder.com/150"
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <Title level={3}>{product.model}</Title>
                            <Space direction="vertical" size="middle">
                                <Text>
                                    <BarcodeOutlined /> <strong>Serial Number:</strong> {product.serial_number}
                                </Text>
                                <Text>
                                    <InboxOutlined /> <strong>Stock:</strong> {product.stock > 0 ? product.stock : 'Out of stock'}
                                </Text>
                                <Text>
                                    <SafetyCertificateOutlined /> <strong>Warranty Status:</strong> {product.warranty_status}
                                </Text>
                                <Text>
                                    <IdcardOutlined /> <strong>Product Id:</strong> {product.product_id}
                                </Text>
                                <Text>
                                    <ShopOutlined /> <strong>Distributor Info:</strong> {product.distributor_info}
                                </Text>
                                <Text>
                                    <FileTextOutlined /> <strong>Description:</strong> {product.description}
                                </Text>
                                <Text>
                                    <DollarOutlined /> <strong>Base Price:</strong> ${parseFloat(product.base_price).toFixed(2)}
                                </Text>
                                <Text>
                                    <TagOutlined /> <strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}
                                </Text>
                            </Space>

                            <Space style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                <InputNumber
                                    min={1}
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(value) => setQuantity(value || 1)}
                                />
                                <Button
                                    type="primary"
                                    icon={<ShoppingCartOutlined />}
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                >
                                    Add to Cart
                                </Button>
                            </Space>

                            <Button
                                type="default"
                                icon={<HeartOutlined />}
                                onClick={handleAddToFavorites}
                                style={{ marginTop: '10px', width: '100%' }}
                            >
                                Add to Favorites
                            </Button>
                        </Col>
                    </Row>

                    <Divider style={{ margin: '40px 0' }}>Return and Exchange Policy</Divider>
                    <Text>
                        At our store, we prioritize customer satisfaction. This product is eligible for returns and exchanges
                        within 30 days of purchase, provided it remains unused and in its original packaging. Please refer to
                        our detailed return policy for more information.
                    </Text>

                    <div style={{ marginTop: '40px' }}>
                        <ApprovedComments />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ProductDetailPage;
