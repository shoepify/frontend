// src/pages/ProductListPage.js

import React, { useEffect, useState } from 'react';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from the backend or context
        // setProducts(fetchedProducts);
    }, []);

    return (
        <div>
            <h1>All Shoes</h1>
            <div>
                {products.map(product => (
                    <div key={product.id}>
                        <h2>{product.name}</h2>
                        <p>{product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductListPage;
