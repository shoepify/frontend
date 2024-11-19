import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard"; // Assuming you have a ProductCard component
import "../styles/CategoryPage.css";

const CategoryPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/products/")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch products");
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setFilteredProducts(data.filter((product) => product.category === category));
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [category]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container">
            <h1>Products in {category}</h1>
            {filteredProducts.length > 0 ? (
                <div className="product-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                            onAddToCart={(productId) => console.log(`Add to cart: ${productId}`)}
                            onAddToFavorites={(productId) => console.log(`Add to favorites: ${productId}`)}
                        />
                    ))}
                </div>
            ) : (
                <p className="empty-category">No products found in this category.</p>
            )}
        </div>
    );
};

export default CategoryPage;
