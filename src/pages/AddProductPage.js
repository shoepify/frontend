import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const AddProductPage = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = (values) => {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === "image") {
                formData.append(key, values[key][0].originFileObj);
            } else {
                formData.append(key, values[key]);
            }
        });

        fetch("http://localhost:8000/products/create/", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    messageApi.error(data.error);
                } else {
                    messageApi.success("Product added successfully!");
                    form.resetFields();
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                messageApi.error("Failed to add product. Please try again.");
            });
    };

    const handleFileValidation = (file) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG files!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must be smaller than 2MB!");
        }
        return isJpgOrPng && isLt2M;
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
                    base_price: "",
                    price: "",
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
                    name="base_price"
                    label="Base Price"
                    rules={[{ required: true, message: "Please enter the base price." }]}
                >
                    <Input type="number" placeholder="Enter base price" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: "Please enter the product price." }]}
                >
                    <Input type="number" placeholder="Enter product price" />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Product Image"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e && [e.file])}
                    rules={[{ required: true, message: "Please upload a product image." }]}
                >
                    <Upload
                        name="image"
                        listType="picture"
                        beforeUpload={handleFileValidation}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
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
