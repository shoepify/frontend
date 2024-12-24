import React from "react";
import { Row, Col, Typography, Space, Divider } from "antd";
import {
    LockOutlined,
    CarOutlined,
    SwapOutlined,
    InfoCircleOutlined,
    ShopOutlined,
    CreditCardOutlined,
    FacebookOutlined,
    InstagramOutlined,
    YoutubeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Footer = () => {
    return (
        <footer style={{ backgroundColor: "#f5f5f5", padding: "40px 20px", textAlign: "center" }}>
            {/* Top Section */}
            <Row gutter={[16, 24]} justify="center">
                <Col xs={24} sm={8} md={6}>
                    <LockOutlined style={{ fontSize: "24px", color: "#000" }} />
                    <Title level={5} style={{ marginTop: "10px" }}>Secure Shopping</Title>
                    <Text>Safe and secure shopping guaranteed.</Text>
                </Col>
                <Col xs={24} sm={8} md={6}>
                    <CarOutlined style={{ fontSize: "24px", color: "#000" }} />
                    <Title level={5} style={{ marginTop: "10px" }}>Free Shipping</Title>
                    <Text>Free shipping on orders over $1000.</Text>
                </Col>
                <Col xs={24} sm={8} md={6}>
                    <SwapOutlined style={{ fontSize: "24px", color: "#000" }} />
                    <Title level={5} style={{ marginTop: "10px" }}>Easy Returns</Title>
                    <Text>Hassle-free returns and exchanges.</Text>
                </Col>
            </Row>

            <Divider style={{ margin: "40px 0" }} />

            {/* Middle Section */}
            <Row gutter={[16, 24]} justify="space-around" align="top">
                <Col xs={24} sm={12} md={6} style={{ textAlign: "left" }}>
                    <Title level={5}>Discover</Title>
                    <Space direction="vertical" size="middle">
                        <Text><InfoCircleOutlined /> About Us</Text>
                        <Text><ShopOutlined /> Stores</Text>
                        <Text><CreditCardOutlined /> Loyalty Card</Text>
                    </Space>
                </Col>
                <Col xs={24} sm={12} md={6} style={{ textAlign: "left" }}>
                    <Title level={5}>Information</Title>
                    <Space direction="vertical" size="middle">
                        <Text>FAQ</Text>
                        <Text>Contact</Text>
                        <Text>Corporate Sales</Text>
                        <Text>Delivery Information</Text>
                        <Text>Returns & Exchanges</Text>
                    </Space>
                </Col>
                <Col xs={24} sm={12} md={6} style={{ textAlign: "left" }}>
                    <Title level={5}>Policies</Title>
                    <Space direction="vertical" size="middle">
                        <Text>Privacy Policy</Text>
                        <Text>Terms of Service</Text>
                        <Text>Cookie Policy</Text>
                        <Text>Legal Information</Text>
                        <Text>Sustainability</Text>
                    </Space>
                </Col>
                <Col xs={24} sm={12} md={6} style={{ textAlign: "left" }}>
                    <Title level={5}>Follow Us</Title>
                    <Space size="large">
                        <FacebookOutlined style={{ fontSize: "24px", color: "#3b5998" }} />
                        <InstagramOutlined style={{ fontSize: "24px", color: "#C13584" }} />
                        <YoutubeOutlined style={{ fontSize: "24px", color: "#FF0000" }} />
                    </Space>
                </Col>
            </Row>

            <Divider style={{ margin: "40px 0" }} />

            {/* Bottom Section */}
            <Row justify="center">
                <Col>
                    <Text>© 2024 CS308 Team. All rights reserved.</Text>
                </Col>
            </Row>
        </footer>
    );
};

export default Footer;