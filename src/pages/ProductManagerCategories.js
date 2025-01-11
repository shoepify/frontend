import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, Typography, message } from "antd";
import axios from "axios";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ProductManagerCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const baseURL = "http://127.0.0.1:8000"; // Adjust to your API base URL

    const fetchCategories = async () => {
        try {
            // Fetch the list of category names
            const response = await axios.get("http://127.0.0.1:8000/list-categories/");
            const categoryNames = response.data.categories || [];
    
            // Fetch details (including description) for each category
            const categoriesWithDetails = await Promise.all(categoryNames.map(async (category) => {
                try {
                    const categoryResponse = await axios.get(`http://127.0.0.1:8000/get-category/${category.name}/`);
                    return categoryResponse.data.category; // This contains the full category info including description
                } catch (error) {
                    console.error(`Error fetching details for category ${category.name}:`, error);
                    return null; // If fetching details fails, return null
                }
            }));
    
            // Filter out null values (categories that failed to load)
            setCategories(categoriesWithDetails.filter(cat => cat !== null));
        } catch (error) {
            console.error("Error fetching category names:", error);
            message.error("Failed to load categories.");
        }
    };

   

    // Add category
    const handleSubmit = async (values) => {
        try {
            // Trim whitespace from category name and description before sending
            values.name = values.name.trim();
            values.description = values.description.trim();

            await axios.post("http://127.0.0.1:8000/add-category/", values);
            message.success("Category added successfully!");

            form.resetFields();
            setIsModalVisible(false);
            fetchCategories(); // Refresh the category list
        } catch (error) {
            console.error("Error saving category:", error);
            message.error("Failed to save category.");
        }
    };

    // Remove a category
    const removeCategory = async (categoryName) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/delete-category/${categoryName.trim()}/`);
            message.success("Category removed successfully!");
            setCategories((prevCategories) =>
                prevCategories.filter((cat) => cat.name !== categoryName)
            );
        } catch (error) {
            // If the error response contains the message "Cannot delete category" (e.g., because it has products)
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                message.error(errorMessage);
            } else {
                console.error("Error removing category:", error);
                message.error("Failed to remove category.");
            }
        }
    };
    

    // Fetch categories when the component is mounted
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
                Manage Product Categories
            </Title>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginBottom: "20px" }}
                onClick={() => {
                    form.resetFields();
                    setIsModalVisible(true);
                }}
            >
                Add Category
            </Button>

            <Table
                dataSource={categories}
                rowKey="name"
                columns={[
                    {
                        title: "Category Name",
                        dataIndex: "name",
                        key: "name",
                    },
                    {
                        title: "Description",
                        dataIndex: "description",
                        key: "description",
                    },
                    {
                        title: "Actions",
                        key: "actions",
                        render: (_, record) => (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <Button
                                    icon={<DeleteOutlined />}
                                    danger
                                    onClick={() => removeCategory(record.name)}
                                >
                                    Delete
                                </Button>
                            </div>
                        ),
                    },
                ]}
            />

            {/* Modal for Add Category */}
            <Modal
                title="Add Category"
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{ required: true, message: "Please enter a category name" }]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Enter category description (optional)"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Add Category
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManagerCategories;
