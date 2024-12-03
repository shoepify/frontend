import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin, Alert, Row, Col, Button, Space } from "antd";
import ProductCard from "../components/ProductCard"; // Assuming you have a ProductCard component

const { Title } = Typography;

const CategoryPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/products/")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch products");
                return response.json();
            })
            .then((data) => {
                const categoryProducts = data.filter((product) => product.category === category);
                setProducts(data);
                setFilteredProducts(categoryProducts);
                setSortedProducts(categoryProducts); // Default is unsorted
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [category]);

    const handleSort = (key) => {
        const sorted = [...filteredProducts].sort((a, b) => {
            if (key === "popularity_score") {
                return b.popularity_score - a.popularity_score || b.price - a.price; // Popularity descending, tiebreaker price
            } else if (key === "price") {
                return b.price - a.price || b.popularity_score - a.popularity_score; // Price descending, tiebreaker popularity
            }
            return 0;
        });
        setSortedProducts(sorted);
    };

    if (loading) {
        return <Spin tip="Loading products..." style={{ display: "block", marginTop: 50 }} />;
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ marginTop: 50 }}
            />
        );
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <Title level={2}>Products in "{category}"</Title>

            {/* Sort Buttons */}
            <Space style={{ marginBottom: "20px" }}>
                <Button type="primary" onClick={() => handleSort("popularity_score")}>
                    Sort by Popularity
                </Button>
                <Button type="primary" onClick={() => handleSort("price")}>
                    Sort by Price
                </Button>
            </Space>

            {sortedProducts.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {sortedProducts.map((product) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.product_id}>
                            <ProductCard
                                product={product}
                                onAddToCart={(productId) => console.log(`Add to cart: ${productId}`)}
                                onAddToFavorites={(productId) =>
                                    console.log(`Add to favorites: ${productId}`)
                                }
                            />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Alert
                    message="No Products Found"
                    description="There are no products available in this category."
                    type="info"
                    showIcon
                    style={{ marginTop: 20 }}
                />
            )}
        </div>
    );
};

export default CategoryPage;
