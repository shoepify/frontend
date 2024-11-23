import React, { useState } from "react";
import SearchBar from "./SearchBar";
import "./style.css";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);

    return (
        <div>
            <header>
                <SearchBar setProducts={setProducts} />
            </header>
            <main className="products-container">
                <h1>Search Results</h1>
                {products.length === 0 ? (
                    <div>No products found</div>
                ) : (
                    <ul>
                        {products.map((product) => (
                            <li key={product.product_id}>
                                <h2>{product.model}</h2>
                                <p>{product.description}</p>
                                <p>Category: {product.category}</p>
                                <p>Price: ${product.price}</p>
                                <p>Distributor: {product.distributor_info}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default ProductsPage;
