import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, message, Modal, Input } from 'antd';

const { Title } = Typography;

const ProductManagerProductPage = () => {
    const [products, setProducts] = useState([]); // Initialize as an empty array
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
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

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    const handleSaveChanges = () => {
        if (selectedProduct && selectedProduct.stock !== undefined) {
            fetch(`http://localhost:8000/products/${selectedProduct.product_id}/update/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stock: selectedProduct.stock, // Only modify the stock
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to update product');
                    }
                    setProducts((prevProducts) =>
                        prevProducts.map((product) =>
                            product.product_id === selectedProduct.product_id
                                ? { ...product, stock: selectedProduct.stock }
                                : product
                        )
                    );
                    message.success('Product updated successfully');
                    setIsModalVisible(false);
                })
                .catch((error) => {
                    message.error(`Error updating product: ${error.message}`);
                });
        }
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
                    <Button onClick={() => handleEditProduct(record)}>Edit</Button>
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

            <Modal
                title="Edit Product"
                visible={isModalVisible}
                onCancel={handleModalClose}
                onOk={handleSaveChanges}
            >
                {selectedProduct && (
                    <>
                        <Input
                            value={selectedProduct.stock}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.value })}
                            placeholder="Stock"
                            style={{ marginBottom: 10 }}
                        />
                    </>
                )}
            </Modal>
        </div>
    );
};

export default ProductManagerProductPage;
