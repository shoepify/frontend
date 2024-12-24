import React, { useState, useEffect } from "react";
import { Card, Button, Image, Typography, Spin, Alert, Tag, Drawer, Space } from "antd";
import {
    DeleteOutlined,
    ShoppingCartOutlined,
    InfoCircleOutlined,
    DollarCircleOutlined,
    CheckCircleOutlined,
    TagOutlined,
    BarcodeOutlined,
    StarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productDetails, setProductDetails] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); // For details drawer

    useEffect(() => {
        const customerId = sessionStorage.getItem("customerId");

        if (!customerId) {
            setError("Unable to fetch favorites. Please log in.");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8000/wishlist/${customerId}/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch wishlist");
                return response.json();
            })
            .then((data) => {
                setFavorites(data.wishlist_items || []);
                const detailPromises = (data.wishlist_items || []).map((item) =>
                    fetch(`http://localhost:8000/products/${item.product_id}/`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }).then((res) => res.json())
                );

                return Promise.all(detailPromises);
            })
            .then((details) => {
                setProductDetails(details);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleAddToCart = (productId) => {
        const guestId = sessionStorage.getItem("guest_id");
        const customerId = sessionStorage.getItem("customerId");

        let url;
        if (customerId) {
            url = `http://localhost:8000/add_to_cart_customer/${customerId}/${productId}/1/`;
        } else if (guestId) {
            url = `http://localhost:8000/add_to_cart_guest/${guestId}/${productId}/1/`;
        } else {
            alert("Error: Unable to determine user type.");
            return;
        }

        fetch(url, { method: "POST", headers: { "Content-Type": "application/json" } })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to add to cart");
                alert("Product added to cart!");
            })
            .catch(() => {
                alert("Failed to add product to cart. Please try again.");
            });
    };

    const handleRemoveFromWishlist = (productId) => {
        const customerId = sessionStorage.getItem("customerId");

        fetch(`http://localhost:8000/wishlist/${customerId}/remove/${productId}/`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to remove item");
                setProductDetails((prev) => prev.filter((product) => product.product_id !== productId));
            })
            .catch(() => {
                alert("Error removing item from wishlist.");
            });
    };

    if (loading) return <Spin tip="Loading favorites..." style={{ textAlign: "center", marginTop: "20px" }} />;
    if (error) return <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: "20px" }} />;

    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>Your Favorites</Title>
            {productDetails.length > 0 ? (
                <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ flex: 2 }}>
                        <Card bordered>
                            {productDetails.map((product) => (
                                <Card.Grid
                                    style={{
                                        width: "33.33%",
                                        padding: "20px",
                                        textAlign: "center",
                                    }}
                                    key={product.product_id}
                                >
                                    <Image
                                        src={`/images/${product.image_name}`}
                                        alt={product.model}
                                        style={{
                                            height: 200,
                                            width: "100%",
                                            objectFit: "contain",
                                            marginBottom: 10,
                                        }}
                                    />
                                    <Title level={5}>{product.model}</Title>
                                    <p>
                                        <Tag color={product.stock > 0 ? "green" : "red"}>
                                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                        </Tag>
                                    </p>
                                    <p>
                                        <Tag color="blue">Price: ${product.price}</Tag>
                                    </p>
                                    <p>
                                        <Tag color="gold">Rating: {product.avg_rating} / 5</Tag>
                                    </p>
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={() => handleAddToCart(product.product_id)}
                                        style={{ marginBottom: "5px", width: "100%" }}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        type="default"
                                        icon={<InfoCircleOutlined />}
                                        onClick={() => setSelectedProduct(product)}
                                        style={{ marginBottom: "5px", width: "100%" }}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        type="primary"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveFromWishlist(product.product_id)}
                                        style={{ width: "100%" }}
                                    >
                                        Remove
                                    </Button>
                                </Card.Grid>
                            ))}
                        </Card>
                    </div>
                    {selectedProduct && (
                        <Drawer
                            title={`Details of ${selectedProduct.model}`}
                            visible={!!selectedProduct}
                            onClose={() => setSelectedProduct(null)}
                            width={400}
                        >
                            <Image
                                src={`/images/${selectedProduct.image_name}`}
                                alt={selectedProduct.model}
                                style={{ height: 300, marginBottom: 20, objectFit: "contain" }}
                            />
                            <Space direction="vertical" size="small">
                                <Text>
                                    <DollarCircleOutlined /> <strong>Price:</strong> ${selectedProduct.price}
                                </Text>
                                <Text>
                                    <CheckCircleOutlined /> <strong>Stock:</strong>{" "}
                                    {selectedProduct.stock > 0 ? "Available" : "Out of Stock"}
                                </Text>
                                <Text>
                                    <StarOutlined /> <strong>Rating:</strong> {selectedProduct.avg_rating} / 5
                                </Text>
                                <Text>
                                    <TagOutlined /> <strong>Category:</strong> {selectedProduct.category}
                                </Text>
                                <Text>
                                    <BarcodeOutlined /> <strong>Serial Number:</strong> {selectedProduct.serial_number}
                                </Text>
                                <Text>
                                    <InfoCircleOutlined /> <strong>Description:</strong> {selectedProduct.description}
                                </Text>
                            </Space>
                        </Drawer>
                    )}
                </div>
            ) : (
                <p>No favorites added yet. Start adding products!</p>
            )}
        </div>
    );
};

export default FavoritesPage;
