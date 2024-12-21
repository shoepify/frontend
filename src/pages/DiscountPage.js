import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal, Typography, Divider, Form, Input, InputNumber, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const DiscountPage = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    const fetchDiscounts = () => {
        setLoading(true);
        axios
            .get("http://localhost:8000/get_discount/1/") // Fetch discounts based on API
            .then((response) => {
                const discountData = response.data.discount;
                if (discountData) {
                    setDiscounts([discountData]); // Set a single discount for now
                } else {
                    setDiscounts([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching discounts:", error);
                message.error("Failed to fetch discounts");
                setLoading(false);
            });
    };

    const handleDelete = (discountId) => {
        Modal.confirm({
            title: "Are you sure you want to delete this discount?",
            onOk: () => {
                axios
                    .delete(`http://localhost:8000/delete_discount/${discountId}/`)
                    .then(() => {
                        message.success("Discount deleted successfully");
                        fetchDiscounts();
                    })
                    .catch((error) => {
                        console.error("Error deleting discount:", error);
                        message.error("Failed to delete discount");
                    });
            },
        });
    };

    const handleCreateDiscount = () => {
        form.validateFields()
            .then((values) => {
                const [start_date, end_date] = values.date_range;
                const discountData = {
                    discount_name: values.discount_name,
                    discount_rate: values.discount_rate,
                    start_date: start_date.format("YYYY-MM-DD"),
                    end_date: end_date.format("YYYY-MM-DD"),
                    product_ids: values.product_ids.split(",").map((id) => parseInt(id.trim())),
                };

                axios.post("http://localhost:8000/create_discount/", discountData)
                    .then(() => {
                        message.success("Discount created successfully");
                        form.resetFields();
                        fetchDiscounts();
                    })
                    .catch((error) => {
                        console.error("Error creating discount:", error);
                        message.error("Failed to create discount");
                    });
            })
            .catch((error) => {
                console.error("Validation Failed:", error);
            });
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const columns = [
        {
            title: "Discount Name",
            dataIndex: "discount_name",
            key: "discount_name",
        },
        {
            title: "Discount Rate (%)",
            dataIndex: "discount_rate",
            key: "discount_rate",
            render: (rate) => <Text>{rate.toFixed(2)}</Text>,
        },
        {
            title: "Start Date",
            dataIndex: "start_date",
            key: "start_date",
        },
        {
            title: "End Date",
            dataIndex: "end_date",
            key: "end_date",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="primary"
                    danger
                    onClick={() => handleDelete(record.discount_id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h2>Manage Discounts</h2>
            <Divider />

            <Form form={form} layout="vertical" style={{ marginBottom: "20px" }}>
                <Form.Item
                    name="discount_name"
                    label="Discount Name"
                    rules={[{ required: true, message: "Please enter a discount name" }]}
                >
                    <Input placeholder="Enter discount name" />
                </Form.Item>

                <Form.Item
                    name="discount_rate"
                    label="Discount Rate (%)"
                    rules={[{ required: true, message: "Please enter a discount rate" }]}
                >
                    <InputNumber min={0} max={100} style={{ width: "100%" }} placeholder="Enter discount rate" />
                </Form.Item>

                <Form.Item
                    name="date_range"
                    label="Date Range"
                    rules={[{ required: true, message: "Please select a date range" }]}
                >
                    <RangePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    name="product_ids"
                    label="Product IDs (comma-separated)"
                    rules={[{ required: true, message: "Please enter product IDs" }]}
                >
                    <Input placeholder="e.g., 1, 2, 3" />
                </Form.Item>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateDiscount}
                >
                    Create Discount
                </Button>
            </Form>

            <Table
                dataSource={discounts}
                columns={columns}
                rowKey="discount_id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default DiscountPage;
