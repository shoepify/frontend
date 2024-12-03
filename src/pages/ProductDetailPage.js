import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, Image, Alert, Spin, Row, Col } from 'antd';
import ApprovedComments from './ApprovedComments';

const { Title, Text } = Typography;

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                                src={product.image_url || 'https://via.placeholder.com/150'}
                                alt={product.model}
                                width="100%"
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <Title level={3}>{product.model}</Title>
                            <Text><strong>Serial Number:</strong> {product.serial_number}</Text>
                            <br />
                            <Text>
                                <strong>Stock:</strong> {product.stock > 0 ? product.stock : 'Out of stock'}
                            </Text>
                            <br />
                            <Text><strong>Warranty Status:</strong> {product.warranty_status}</Text>
                            <br />
                            <Text><strong>Product Id:</strong> {product.product_id}</Text>
                            <br />
                            <Text><strong>Distributor Info:</strong> {product.distributor_info}</Text>
                            <br />
                            <Text><strong>Description:</strong> {product.description}</Text>
                            <br />
                            <Text><strong>Base Price:</strong> ${parseFloat(product.base_price).toFixed(2)}</Text>
                            <br />
                            <Text><strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}</Text>
                        </Col>
                    </Row>
                    <div style={{ marginTop: '40px' }}>
                        <ApprovedComments />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ProductDetailPage;
