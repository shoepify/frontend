import React from "react";
import { Typography, Card, Layout, Space } from "antd";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const SalesManagerHome = () => {
    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
            <Content style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
                <Card style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        {/* Title */}
                        <Title level={2} style={{ textAlign: "center" }}>
                            Sales Manager Panel Instructions
                        </Title>

                        {/* General Overview */}
                        <Title level={4}>General Overview</Title>
                        <Paragraph>
                            Welcome to the Sales Manager Dashboard! This platform is designed to help you efficiently
                            manage discounts, refunds, and monitor sales performance. Please follow the instructions
                            below to make the most of your dashboard.
                        </Paragraph>

                        {/* Dashboard Navigation */}
                        <Title level={4}>Navigation</Title>
                        <Paragraph>
                            Use the navigation buttons on the header to access the following features:
                        </Paragraph>
                        <ul>
                            <li>
                                <strong>Dashboard:</strong> View key metrics and performance indicators related to sales
                                and discounts.
                            </li>
                            <li>
                                <strong>Discounts:</strong> Create, edit, or remove discounts for products or categories.
                            </li>
                            <li>
                                <strong>Refunds:</strong> Review and approve customer refund requests.
                            </li>
                        </ul>

                        {/* Creating Discounts */}
                        <Title level={4}>Creating Discounts</Title>
                        <Paragraph>
                            To create a new discount:
                        </Paragraph>
                        <ol>
                            <li>Navigate to the "Discounts" page using the header button.</li>
                            <li>Click on "Create New Discount" and fill in the required details (e.g., product, percentage, duration).</li>
                            <li>Review the information and click "Submit" to activate the discount.</li>
                        </ol>

                        {/* Managing Refunds */}
                        <Title level={4}>Managing Refunds</Title>
                        <Paragraph>
                            Refund requests will appear under the "Refunds" section:
                        </Paragraph>
                        <ul>
                            <li>Review customer requests and the reason for the refund.</li>
                            <li>Click "Approve" to process the refund or "Reject" to decline the request.</li>
                        </ul>

                        {/* Logging Out */}
                        <Title level={4}>Logging Out</Title>
                        <Paragraph>
                            To log out, click the "Logout" button on the top-right corner of the header. Ensure that all
                            your changes are saved before logging out.
                        </Paragraph>

                        {/* Support */}
                        <Title level={4}>Need Assistance?</Title>
                        <Paragraph>
                            If you encounter any issues or need further assistance, please contact the support team at{" "}
                            <a href="mailto:support@salesmanager.com">support@salesmanager.com</a>.
                        </Paragraph>
                    </Space>
                </Card>
            </Content>
        </Layout>
    );
};

export default SalesManagerHome;
