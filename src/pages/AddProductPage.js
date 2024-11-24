import React, { useState } from "react";

const AddProductPage = () => {
    const [productData, setProductData] = useState({
        model: "",
        serial_number: "",
        stock: "",
        warranty_status: "",
        distributor_info: "",
        description: "",
        base_price: "",
        price: "",
        category: "",
    });

    const [message, setMessage] = useState(""); // To display success or error messages

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8000/products/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setMessage(data.error); // Display error from backend
                } else {
                    setMessage("Product added successfully!");
                    setProductData({
                        model: "",
                        serial_number: "",
                        stock: "",
                        warranty_status: "",
                        distributor_info: "",
                        description: "",
                        base_price: "",
                        price: "",
                        category: "",
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setMessage("Failed to add product. Please try again.");
            });
    };

    return (
        <div>
            <h1>Add New Product</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Model:</label>
                    <input
                        type="text"
                        name="model"
                        value={productData.model}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Serial Number:</label>
                    <input
                        type="text"
                        name="serial_number"
                        value={productData.serial_number}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Stock:</label>
                    <input
                        type="number"
                        name="stock"
                        value={productData.stock}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Warranty Status:</label>
                    <input
                        type="text"
                        name="warranty_status"
                        value={productData.warranty_status}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Distributor Info:</label>
                    <input
                        type="text"
                        name="distributor_info"
                        value={productData.distributor_info}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Base Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        name="base_price"
                        value={productData.base_price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProductPage;
