import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, message } from 'antd';

const { Title } = Typography;

const ProductManagerProductPage = () => {
    const [products, setProducts] = useState([]); // Initialize as an empty array
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch products from API
        fetch('http://localhost:8000/products/') // Replace with your API endpoint
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    const handleEditProduct = (productId) => {
        message.info(`Edit product: ${productId}`);
        // Navigate to edit page or show a modal
    };

    const handleDeleteProduct = (productId) => {
        fetch(`http://localhost:8000/products/${productId}/delete/`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }
                setProducts((prevProducts) => prevProducts.filter((p) => p.product_id !== productId));
                message.success('Product deleted successfully');
            })
            .catch((error) => {
                message.error(`Error deleting product: ${error.message}`);
            });
    };

    const columns = [
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'Serial Number',
            dataIndex: 'serial_number',
            key: 'serial_number',
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Warranty Status',
            dataIndex: 'warranty_status',
            key: 'warranty_status',
        },
        {
            title: 'Distributor Info',
            dataIndex: 'distributor_info',
            key: 'distributor_info',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Base Price',
            dataIndex: 'base_price',
            key: 'base_price',
            render: (price) => `$${price}`,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleEditProduct(record.product_id)}>Edit</Button>
                    <Button danger onClick={() => handleDeleteProduct(record.product_id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    if (isLoading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ marginBottom: '20px' }}>
                Product Manager: Manage Products
            </Title>
            <Table
                dataSource={products}
                columns={columns}
                rowKey="product_id"
                pagination={{ pageSize: 10 }}
                bordered
            />
        </div>
    );
};

export default ProductManagerProductPage;
