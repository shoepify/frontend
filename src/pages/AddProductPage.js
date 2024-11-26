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
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setMessage("Failed to add product. Please try again.");
            });
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Add New Product</h1>
            {message && <p style={styles.message}>{message}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                {[
                    { label: "Model", type: "text", name: "model" },
                    { label: "Serial Number", type: "text", name: "serial_number" },
                    { label: "Stock", type: "number", name: "stock" },
                    { label: "Warranty Status", type: "text", name: "warranty_status" },
                    { label: "Distributor Info", type: "text", name: "distributor_info" },
                    { label: "Description", type: "textarea", name: "description" },
                    { label: "Base Price", type: "number", name: "base_price", step: "0.01" },
                    { label: "Price", type: "number", name: "price", step: "0.01" },
                ].map((input) => (
                    <div key={input.name} style={styles.inputContainer}>
                        <label style={styles.label}>{input.label}:</label>
                        {input.type === "textarea" ? (
                            <textarea
                                name={input.name}
                                value={productData[input.name]}
                                onChange={handleInputChange}
                                style={styles.textarea}
                                required
                            ></textarea>
                        ) : (
                            <input
                                type={input.type}
                                name={input.name}
                                value={productData[input.name]}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                                step={input.step}
                            />
                        )}
                    </div>
                ))}
                <button type="submit" style={styles.button}>
                    Add Product
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        backgroundColor: "#fff",
    },
    heading: {
        textAlign: "center",
        color: "#333",
        marginBottom: "20px",
        fontFamily: "'Poppins', sans-serif",
    },
    message: {
        textAlign: "center",
        color: "green",
        marginBottom: "20px",
        fontFamily: "'Poppins', sans-serif",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    inputContainer: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        fontSize: "14px",
        color: "#555",
        marginBottom: "5px",
        fontFamily: "'Poppins', sans-serif",
    },
    input: {
        padding: "10px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        outline: "none",
        transition: "border-color 0.3s",
    },
    textarea: {
        padding: "10px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        outline: "none",
        resize: "vertical",
        height: "100px",
    },
    button: {
        padding: "12px 20px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontFamily: "'Poppins', sans-serif",
        textAlign: "center",
        marginTop: "10px",
    },
    inputFocus: {
        borderColor: "#007bff",
    },
};

export default AddProductPage;
