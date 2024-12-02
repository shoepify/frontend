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
        image_url: "", // New field to store the uploaded image URL
    });

    const [message, setMessage] = useState(""); // To display success or error messages
    const [selectedFile, setSelectedFile] = useState(null); // Store the selected image file

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // Store the selected file
    };

  
    const uploadImageToS3 = async () => {
        if (!selectedFile) {
            setMessage("Please select an image to upload.");
            return null;
        }
    
        try {
            console.log("Requesting pre-signed URL...");
            const fileName = selectedFile.name;
            const fileType = selectedFile.type;
    
            const presignedUrlResponse = await fetch(
                `http://localhost:8000/generate-upload-url/?file_name=${fileName}&file_type=${fileType}`
            );
    
            if (!presignedUrlResponse.ok) {
                throw new Error("Failed to fetch pre-signed URL.");
            }
    
            const { url } = await presignedUrlResponse.json();
            console.log("Pre-signed URL received:", url);
    
            console.log("Uploading file to S3...");
            const uploadResponse = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": fileType, // Ensure Content-Type matches file type
                },
                body: selectedFile,
            });
    
            console.log("S3 Upload Response Status:", uploadResponse.status);
    
            if (!uploadResponse.ok) {
                const errorDetails = await uploadResponse.text();
                console.error("S3 Upload Error Details:", errorDetails);
                throw new Error("Image upload to S3 failed.");
            }
    
            console.log("File uploaded successfully!");
            return url.split("?")[0]; // Return S3 file URL without query params
        } catch (error) {
            console.error("Error during image upload:", error);
            setMessage("Failed to upload image. Please try again.");
            return null;
        }
    };
    
   
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Step 1: Upload the image to S3
        const imageUrl = await uploadImageToS3();
        if (!imageUrl) return; // Stop if image upload fails
    
        // Step 2: Add the image URL to the product data
        const productWithImage = { ...productData, image_url: imageUrl };
    
        // Step 3: Submit product data to the backend
        try {
            const response = await fetch("http://localhost:8000/products/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productWithImage),
            });
    
            const data = await response.json();
            if (data.error) {
                setMessage(data.error); // Handle backend error
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
                    image_url: "",
                });
                setSelectedFile(null); // Reset file input
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setMessage("Failed to add product. Please try again.");
        }
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
                <div style={styles.inputContainer}>
                    <label style={styles.label}>Image:</label>
                    <input
                        type="file"
                       
                        onChange={handleFileChange}
                        style={styles.input}
                        required
                    />
                </div>
                <button type="submit" style={styles.button}>
                    Add Product
                </button>
            </form>
        </div>
    );
};

const styles = {
    // Styles remain the same
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
};

export default AddProductPage;
