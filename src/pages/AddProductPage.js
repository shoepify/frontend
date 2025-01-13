import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Typography, Modal } from "antd";

const { Title } = Typography;

const AddProductPage = () => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");  // Store selected image name
    const [messageApi, contextHolder] = message.useMessage();

    // Fetch categories from backend
    useEffect(() => {
        fetch("http://127.0.0.1:8000/list-categories/")
            .then((response) => response.json())
            .then((data) => {
                setCategories(data.categories);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                messageApi.error("Failed to load categories.");
            });
    }, []);

    const handleSubmit = (values) => {
        // Prepare the category object with name only
        const categoryData = {
            name: values.category,  // Send only the category name
        };

        // Prepare the payload for the backend, ensuring price is renamed to base_price
        const payload = {
            model: values.model,
            serial_number: values.serial_number,
            stock: values.stock,
            warranty_status: values.warranty_status,
            distributor_info: values.distributor_info,
            description: values.description,
            base_price: values.price,  // Send price as base_price
            cost: values.cost,
            category: categoryData,  // Send category as an object with "name" field
            popularity_score: values.popularity_score || 0,
            image_name: selectedImage,  // Send the selected image name (from file input)
        };

        // Send the data to backend
        fetch("http://localhost:8000/add-product/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Ensure content is JSON
            },
            body: JSON.stringify(payload),  // Convert the payload to JSON
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    messageApi.error(data.error);
                } else {
                    messageApi.success("Product added successfully!");
                    form.resetFields();
                    setSelectedImage(""); // Reset selected image after submission
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                messageApi.error("Failed to add product. Please try again.");
            });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];  // Get the selected file
        if (file) {
            setSelectedImage(file.name);  // Set the file name (not the full path)
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            {contextHolder}
            <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>Add New Product</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    model: "",
                    serial_number: "",
                    stock: "",
                    warranty_status: "",
                    distributor_info: "",
                    description: "",
                    price: "",  // Only price field here
                    category: "",  // Default empty, will be selected by the user
                    cost: "",  // Cost field added
                }}
            >
                <Form.Item
                    name="model"
                    label="Model"
                    rules={[{ required: true, message: "Please enter the model." }]}
                >
                    <Input placeholder="Enter product model" />
                </Form.Item>

                <Form.Item
                    name="serial_number"
                    label="Serial Number"
                    rules={[{ required: true, message: "Please enter the serial number." }]}
                >
                    <Input placeholder="Enter serial number" />
                </Form.Item>

                <Form.Item
                    name="stock"
                    label="Stock"
                    rules={[{ required: true, message: "Please enter the stock quantity." }]}
                >
                    <Input type="number" placeholder="Enter stock quantity" />
                </Form.Item>

                <Form.Item
                    name="warranty_status"
                    label="Warranty Status"
                    rules={[{ required: true, message: "Please enter the warranty status." }]}
                >
                    <Input placeholder="Enter warranty status" />
                </Form.Item>

                <Form.Item
                    name="distributor_info"
                    label="Distributor Info"
                    rules={[{ required: true, message: "Please enter the distributor information." }]}
                >
                    <Input placeholder="Enter distributor info" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please enter the product description." }]}
                >
                    <Input.TextArea placeholder="Enter product description" rows={4} />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: "Please enter the product price." }]}
                >
                    <Input type="number" placeholder="Enter product price" />
                </Form.Item>

                {/* Category Selection: Send category name */}
                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: "Please select a category." }]}
                >
                    <Select
                        placeholder="Select category"
                        options={categories.map((category) => ({
                            value: category.name,  // Sending name instead of id
                            label: category.name,
                        }))}
                    />
                </Form.Item>

                {/* Cost Field */}
                <Form.Item
                    name="cost"
                    label="Cost"
                    rules={[{ required: true, message: "Please enter the product cost." }]}
                >
                    <Input type="number" placeholder="Enter product cost" />
                </Form.Item>

                {/* Image Name Field */}
                <Form.Item label="Image Name">
                    <input type="file" onChange={handleImageChange} />
                    {selectedImage && <p>Selected Image: {selectedImage}</p>}  {/* Display selected image name */}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Add Product
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddProductPage;
