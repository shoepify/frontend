import React, { useEffect, useState } from "react";
import { Button, Spin, Alert, Row, Col, Typography, Space, Select } from "antd";
import ProductCard from "../components/ProductCard";

const { Title } = Typography;
const { Option } = Select;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]); // Ordered products
    const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All"); // Category filter

    // Fetch all products from the backend
    useEffect(() => {
        fetch("http://localhost:8000/products/")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch products");
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setSortedProducts(data); // Default unsorted state
                setFilteredProducts(data); // Default filtered state
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    // Sort products based on selected key
    const handleSort = (key) => {
        const sorted = [...filteredProducts].sort((a, b) => {
            if (key === "popularity_score") {
                return b.popularity_score - a.popularity_score || b.price - a.price; // Popularity descending, price descending if equal
            } else if (key === "price") {
                return b.price - a.price || b.popularity_score - a.popularity_score; // Price descending, popularity descending if equal
            }
            return 0;
        });
        setSortedProducts(sorted);
    };

    // Filter products by category
    const handleFilterByCategory = (category) => {
        setSelectedCategory(category);
        if (category === "All") {
            setFilteredProducts(products);
            setSortedProducts(products);
        } else {
            const filtered = products.filter((product) => product.category === category);
            setFilteredProducts(filtered);
            setSortedProducts(filtered);
        }
    };

    if (loading) return <Spin tip="Loading products..." style={{ display: "block", margin: "20px auto" }} />;
    if (error) return <Alert message="Error" description={error.message} type="error" showIcon style={{ margin: "20px" }} />;

    // Extract unique categories
    const categories = ["All", ...new Set(products.map((product) => product.category))];

    return (
        <div style={{ padding: "20px" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
                Featured Products
            </Title>

            {/* Sort and Filter Options */}
            <Space style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }} wrap>
                <Select
                    value={selectedCategory}
                    onChange={handleFilterByCategory}
                    style={{ width: "200px" }}
                    placeholder="Filter by Category"
                >
                    {categories.map((category) => (
                        <Option key={category} value={category}>
                            {category}
                        </Option>
                    ))}
                </Select>
                <Button type="primary" onClick={() => handleSort("popularity_score")}>
                    Sort by Popularity
                </Button>
                <Button type="primary" onClick={() => handleSort("price")}>
                    Sort by Price
                </Button>
            </Space>

            {/* Product Grid */}
            <Row gutter={[24, 24]}>
                {sortedProducts.map((product) => (
                    <Col key={product.product_id} xs={24} sm={12} md={8} lg={6}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default HomePage;
