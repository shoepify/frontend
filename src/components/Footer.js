// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Message Section */}
      <div className="footer-message">
        <h2>Good shoes take you good places.</h2>
        <p>Life is short. Buy the shoes, take the adventure, live the journey.</p>
      </div>

      <div className="footer-content">
        {/* Newsletter Signup */}
        <div className="footer-newsletter">
          <h3>Newsletter Signup</h3>
          <p>Sign up for exclusive offers, discounted prices and more.</p>
          <form>
            <input type="email" placeholder="E-Mail *" required />
            <button type="submit">Sign Me Up</button>
          </form>
        </div>

        {/* Help Links */}
        <div className="footer-help">
          <h3>Need Help?</h3>
          <div className="help-links">
            <Link to="/login" className="footer-button">Login</Link> {/* Apply button styling */}
            <button className="footer-button">Delivery</button>
            <button className="footer-button">Sign Up</button>
            <Link to="/favorites" className="footer-button">Favorites</Link>
            <button className="footer-button">About Us</button>
          </div>
          
          <p><a href="#!">Do Not Sell or Share My Data</a></p>
        </div>

        {/* More Info Links */}
        <div className="footer-info">
          <h3>Categories</h3>
          <ul>
            <li><a href="#!">Men's Shoes</a></li>
            <li><a href="#!">Women's Shoes</a></li>
            <li><a href="#!">Kids' Shoes</a></li>
            <li><a href="#!">Sneakers</a></li>
            <li><a href="#!">Boots</a></li>
            <li><a href="#!">Sandals</a></li>
            <li><a href="#!">Athletic Shoes</a></li>
            <li><a href="#!">Casual Shoes</a></li>
            <li><a href="#!">Dress Shoes</a></li>
            <li><a href="#!">Slippers</a></li>
            <li><a href="#!">Clearance</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2024 CS308 Team Inc. All Rights Reserved.</p>
        <p>English (US)</p>
      </div>
    </footer>
  );
};

export default Footer;
