import React from "react";
import { Card, Button, InputNumber, Tag, Image } from "antd";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
    const [quantity, setQuantity] = React.useState(1);
    const navigate = useNavigate();

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

    const handleAddToWishlist = () => {
        const customerId = sessionStorage.getItem("customerId");

        if (!customerId) {
            alert("You need to be logged in as a customer to add items to the wishlist.");
            return;
        }

        const url = `http://localhost:8000/wishlist/${customerId}/add/${product.product_id}/`;

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to add to wishlist");
                return response.json();
            })
            .then(() => {
                alert("Product successfully added to wishlist!");
            
            })
            .catch((error) => {
                console.error("Error adding to wishlist:", error);
                alert("Failed to add product to wishlist. Please try again.");
            });
    };

    return (
        <Card
            hoverable
            title={product.model}
            style={{ width: 300, margin: "20px" }}
            cover={
                <Image
                    src={`/images/${product.image_name}`} // public/images içinden doğrudan erişim
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
                <Tag color="blue">Popularity: {parseFloat(product.popularity_score).toFixed(2)}</Tag>
            </p>
            <p>
                <Tag color="gold">Average Rating: {parseFloat(product.avg_rating).toFixed(2)} / 5</Tag>
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
            <Button
                type="default"
                icon={<HeartOutlined />}
                onClick={handleAddToWishlist}
                style={{ marginBottom: "10px", width: "100%" }}
            >
                Add to Wishlist
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
