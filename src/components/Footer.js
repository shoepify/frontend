import React from "react";
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, YoutubeOutlined } from "@ant-design/icons";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer" style={{ backgroundColor: "#2c3e50", color: "#ecf0f1", padding: "20px 50px" }}>
      {/* Top Section */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        {/* Logo Section */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>Bag Store</h2>
          <p>Your one-stop shop for all types of bags.</p>
        </div>

        {/* Links Section */}
        <div style={{ flex: 2, display: "flex", justifyContent: "space-around" }}>
          <div>
            <h4 style={{ fontWeight: "bold", marginBottom: "10px" }}>Information</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>About Us</li>
              <li>Contact</li>
              <li>FAQ</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: "bold", marginBottom: "10px" }}>Quick Links</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>Home</li>
              <li>Categories</li>
              <li>My Account</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{ flex: 1 }}>
          <h4 style={{ fontWeight: "bold", marginBottom: "10px" }}>Contact</h4>
          <p>Phone: +123 456 789</p>
          <p>Email: support@bagstore.com</p>
          <p>Address: 123 Bag Street, City, Country</p>
        </div>
      </div>

      {/* Social Media Section */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h4 style={{ fontWeight: "bold", marginBottom: "10px" }}>Follow Us</h4>
        <div>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ margin: "0 10px", color: "#3b5998" }}>
            <FacebookOutlined style={{ fontSize: "24px" }} />
          </a>
          <a href="https://instagram.com/mert_ulu/" target="_blank" rel="noopener noreferrer" style={{ margin: "0 10px", color: "#E4405F" }}>
            <InstagramOutlined style={{ fontSize: "24px" }} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ margin: "0 10px", color: "#1DA1F2" }}>
            <TwitterOutlined style={{ fontSize: "24px" }} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ margin: "0 10px", color: "#FF0000" }}>
            <YoutubeOutlined style={{ fontSize: "24px" }} />
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ textAlign: "center", borderTop: "1px solid #7f8c8d", paddingTop: "10px" }}>
        <p>&copy; 2024 Bag Store. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
