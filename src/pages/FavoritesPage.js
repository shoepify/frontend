import React, { useState, useEffect } from "react";
import { Card, Button, Image, Typography, Spin, Alert, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productDetails, setProductDetails] = useState([]);

    useEffect(() => {
        const customerId = sessionStorage.getItem("customerId");

        if (!customerId) {
            setError("Unable to fetch favorites. Please log in.");
            setLoading(false);
            return;
        }

        // 1. Fetch wishlist (only product IDs and models)
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
                return data.wishlist_items || [];
            })
            .then((wishlistItems) => {
                // 2. Fetch product details for each product_id
                const detailPromises = wishlistItems.map((item) =>
                    fetch(`http://localhost:8000/products/${item.product_id}/`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }).then((res) => res.json())
                );

                return Promise.all(detailPromises);
            })
            .then((productDetails) => {
                setProductDetails(productDetails);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

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
            .catch((error) => {
                console.error("Error removing item:", error);
                alert("Error removing item from wishlist.");
            });
    };

    if (loading) return <Spin tip="Loading favorites..." style={{ marginTop: "20px", textAlign: "center" }} />;
    if (error) return <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: "20px" }} />;

    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>Your Favorites</Title>
            {productDetails.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {productDetails.map((product) => (
                        <Card
                            key={product.product_id}
                            hoverable
                            title={product.model}
                            style={{ width: 300 }}
                            cover={
                                <Image
                                    src={`/images/${product.image_name}`}
                                    alt={product.model}
                                    style={{ height: 200, objectFit: "cover" }}
                                />
                            }
                        >
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
                                icon={<DeleteOutlined />}
                                danger
                                onClick={() => handleRemoveFromWishlist(product.product_id)}
                                style={{ marginTop: "10px", width: "100%" }}
                            >
                                Remove from Wishlist
                            </Button>
                        </Card>
                    ))}
                </div>
            ) : (
                <p>No favorites added yet. Start adding products!</p>
            )}
        </div>
    );
};

export default FavoritesPage;
