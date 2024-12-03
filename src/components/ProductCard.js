import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, InputNumber, Tag, Image } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
    const [popularityScore, setPopularityScore] = useState(product.popularity_score || 0);
    const [averageRating, setAverageRating] = useState(product.avg_rating || 0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetch(`http://localhost:8000/products/${product.product_id}/popularity/`)
            .then((response) => response.json())
            .then((data) => setPopularityScore(data.popularity_score || 0))
            .catch((error) => console.error("Error fetching popularity score:", error));
    }, [product.product_id]);

    useEffect(() => {
        fetch(`http://localhost:8000/products/${product.product_id}/rating/`)
            .then((response) => response.json())
            .then((data) => setAverageRating(data.avg_rating || 0))
            .catch((error) => console.error("Error fetching average rating:", error));
    }, [product.product_id]);

    const handleAddToCart = () => {
        const guestId = sessionStorage.getItem("guest_id");
        const customerId = sessionStorage.getItem("customerId");

        let url;
        let userId;

        if (customerId) {
            userId = customerId;
            url = `http://localhost:8000/add_to_cart_customer/${userId}/${product.product_id}/${quantity}/`;
        } else if (guestId) {
            userId = guestId;
            url = `http://localhost:8000/add_to_cart_guest/${userId}/${product.product_id}/${quantity}/`;
        } else {
            console.error("User must be either a guest or a customer to add to cart.");
            alert("Error: Unable to determine user type.");
            return;
        }

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to add to cart");
                return response.json();
            })
            .then(() => {
                alert("Product successfully added to cart!");
            })
            .catch((error) => {
                console.error("Error adding to cart:", error);
                alert("Failed to add product to cart. Please try again.");
            });
    };

    return (
        <Card
            hoverable
            title={product.model}
            style={{ width: 300, margin: "20px" }}
            cover={
                <Image
                    src={product.image_url || "https://via.placeholder.com/300"}
                    alt={product.model}
                    style={{ height: 200, objectFit: "cover" }}
                />
            }
        >
            <p>
                <Tag color={product.stock > 0 ? "green" : "red"}>
                    {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
                </Tag>
            </p>
            <p>
                <Tag color="blue">Popularity: {popularityScore}</Tag>
            </p>
            <p>
                <Tag color="gold">Average Rating: {averageRating} / 5</Tag>
            </p>
            <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
            <div style={{ marginBottom: "10px" }}>
                Quantity:{" "}
                <InputNumber
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                    style={{ marginLeft: "10px" }}
                />
            </div>
            <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                style={{ marginBottom: "10px", width: "100%" }}
            >
                Add to Cart
            </Button>
            <Link to={`/products/${product.product_id}`}>
                <Button type="default" style={{ width: "100%" }}>
                    View Details
                </Button>
            </Link>
        </Card>
    );
};

export default ProductCard;
