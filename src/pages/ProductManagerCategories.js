import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, Typography, message } from "antd";
import axios from "axios";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const ProductManagerCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingCategory, setEditingCategory] = useState(null);

    const baseURL = "http://127.0.0.1:8000"; // Adjust to your API base URL

    // Fetch categories from the server
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${baseURL}/category/view/`);
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            message.error("Failed to load categories.");
        }
    };

    // Add or Edit category
    const handleSubmit = async (values) => {
        try {
            if (editingCategory) {
                await axios.put(`${baseURL}/category/edit/${editingCategory.name}/`, values);
                message.success("Category updated successfully!");
            } else {
                await axios.post(`${baseURL}/category/add/`, values);
                message.success("Category added successfully!");
            }

            form.resetFields();
            setIsModalVisible(false);
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            message.error("Failed to save category.");
        }
    };

    // Remove a category
    const removeCategory = async (categoryName) => {
        try {
            await axios.delete(`${baseURL}/category/remove/${categoryName}/`);
            message.success("Category removed successfully!");
            setCategories((prevCategories) =>
                prevCategories.filter((cat) => cat.name !== categoryName)
            );
        } catch (error) {
            console.error("Error removing category:", error);
            message.error("Failed to remove category.");
        }
    };

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
                    setEditingCategory(null);
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
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        setEditingCategory(record);
                                        form.setFieldsValue(record);
                                        setIsModalVisible(true);
                                    }}
                                >
                                    Edit
                                </Button>
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

            {/* Modal for Add/Edit Category */}
            <Modal
                title={editingCategory ? "Edit Category" : "Add Category"}
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingCategory(null);
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
                            {editingCategory ? "Update" : "Add"} Category
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManagerCategories;
