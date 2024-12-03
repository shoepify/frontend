import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Spin, Alert, Row, Col, Button, Space } from 'antd';
import ProductCard from '../components/ProductCard';

const { Title } = Typography;

const SearchResultPage = () => {
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]); // State for sorted products
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extract the search query from the URL
    const query = new URLSearchParams(useLocation().search).get('q');

    useEffect(() => {
        if (query) {
            fetch(`http://localhost:8000/products/search/?q=${query}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch search results');
                    }
                    return response.json();
                })
                .then((data) => {
                    setProducts(data);
                    setSortedProducts(data); // Default sorted products are the same as fetched products
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error fetching search results:', err);
                    setError(err);
                    setLoading(false);
                });
        }
    }, [query]);

    const handleSort = (key) => {
        const sorted = [...products].sort((a, b) => {
            if (key === 'popularity_score') {
                return b.popularity_score - a.popularity_score || b.price - a.price; // Sort by popularity descending, price as tiebreaker
            } else if (key === 'price') {
                return b.price - a.price || b.popularity_score - a.popularity_score; // Sort by price descending, popularity as tiebreaker
            }
            return 0;
        });
        setSortedProducts(sorted);
    };

    if (loading) {
        return <Spin tip="Loading search results..." style={{ display: 'block', marginTop: 50 }} />;
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error.message}
                type="error"
                showIcon
                style={{ marginTop: 50 }}
            />
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <Title level={2}>Search Results for "{query}"</Title>

            {/* Sort Buttons */}
            <Space style={{ marginBottom: '20px' }}>
                <Button type="primary" onClick={() => handleSort('popularity_score')}>
                    Sort by Popularity
                </Button>
                <Button type="primary" onClick={() => handleSort('price')}>
                    Sort by Price
                </Button>
            </Space>

            {sortedProducts.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {sortedProducts.map((product) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.product_id}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Alert
                    message="No products found"
                    description={`No products match your search query: "${query}".`}
                    type="info"
                    showIcon
                    style={{ marginTop: 20 }}
                />
            )}
        </div>
    );
};

export default SearchResultPage;
