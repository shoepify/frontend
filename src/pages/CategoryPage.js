import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard"; // Assuming you have a ProductCard component
import "../styles/CategoryPage.css";

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container">
            <h1>Products in {category}</h1>

            {/* Sort Buttons */}
            <div className="sort-buttons">
                <button onClick={() => handleSort("popularity_score")}>Sort by Popularity</button>
                <button onClick={() => handleSort("price")}>Sort by Price</button>
            </div>

            {sortedProducts.length > 0 ? (
                <div className="product-grid">
                    {sortedProducts.map((product) => (
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
