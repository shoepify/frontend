import React, { useEffect, useState } from "react";
import { Button, Spin, Alert, Row, Col, Typography, Space, Checkbox, Slider, Carousel } from "antd";
import ProductCard from "../components/ProductCard";

const { Title } = Typography;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]); // Ordered products
    const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
    const [starRange, setStarRange] = useState([0, 5]); // Default star range
    const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories

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

    // Handle price range filter
    const handlePriceRangeChange = (value) => {
        setPriceRange(value);
        filterProducts(value, starRange, selectedCategories);
    };

    // Handle star rating range filter
    const handleStarRangeChange = (value) => {
        setStarRange(value);
        filterProducts(priceRange, value, selectedCategories);
    };

    // Handle category filter
    const handleCategoryChange = (checkedValues) => {
        setSelectedCategories(checkedValues);
        filterProducts(priceRange, starRange, checkedValues);
    };

    // Apply all filters
    const filterProducts = (price, stars, categories) => {
        let filtered = products;

        // Filter by price range
        filtered = filtered.filter((product) => product.price >= price[0] && product.price <= price[1]);

        // Filter by star rating range
        filtered = filtered.filter(
            (product) => product.popularity_score >= stars[0] && product.popularity_score <= stars[1]
        );

        // Filter by selected categories
        if (categories.length > 0) {
            filtered = filtered.filter((product) => categories.includes(product.category));
        }

        setFilteredProducts(filtered);
        setSortedProducts(filtered);
    };

    if (loading) return <Spin tip="Loading products..." style={{ display: "block", margin: "20px auto" }} />;
    if (error) return <Alert message="Error" description={error.message} type="error" showIcon style={{ margin: "20px" }} />;

    // Extract unique categories
    const categories = [...new Set(products.map((product) => product.category))];

    // Determine min and max values for price and stars
    const maxPrice = Math.max(...products.map((product) => product.price), 1000);
    const minStars = 0;
    const maxStars = 5;

    const bannerImages = [
        "/images/banner1.jpg",
        "/images/banner2.jpg",
        "/images/banner3.jpg",
        "/images/banner4.jpg",
        "/images/banner5.jpg",
    ];

    return (
        <div style={{ padding: "20px" }}>
            {/* Banner */}
            <Carousel autoplay>
                {bannerImages.map((src, index) => (
                    <div key={index}>
                        <img src={src} alt={`Banner ${index + 1}`} style={{ width: "100%", height: "400px", objectFit: "cover" }} />
                    </div>
                ))}
            </Carousel>

            {/* Filters and Sorting */}
            <Space direction="vertical" size="small" style={{ display: "block", margin: "20px 0" }}>
                {/* Category Filters */}
                <Checkbox.Group
                    options={categories.map((category) => ({ label: category, value: category }))}
                    onChange={handleCategoryChange}
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                />

                {/* Price and Star Range Filters */}
                <Space style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Price Range */}
                    <div style={{ flex: 1, marginRight: "10px" }}>
                        <Title level={5}>Price Range</Title>
                        <Slider
                            range
                            min={0}
                            max={maxPrice}
                            value={priceRange}
                            onChange={handlePriceRangeChange}
                            tooltip={{ formatter: (value) => `$${value}` }}
                            style={{ height: "30px" }}
                        />
                    </div>

                    {/* Star Range */}
                    <div style={{ flex: 1 }}>
                        <Title level={5}>Star Rating</Title>
                        <Slider
                            range
                            min={minStars}
                            max={maxStars}
                            value={starRange}
                            onChange={handleStarRangeChange}
                            tooltip={{ formatter: (value) => `${value} Stars` }}
                            style={{ height: "30px" }}
                        />
                    </div>
                </Space>

                {/* Sort Options */}
                <Space>
                    <Button type="primary" onClick={() => handleSort("popularity_score")}>
                        Sort by Popularity
                    </Button>
                    <Button type="primary" onClick={() => handleSort("price")}>
                        Sort by Price
                    </Button>
                </Space>
            </Space>

            {/* Product Grid */}
            <Row gutter={[16, 16]}>
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
