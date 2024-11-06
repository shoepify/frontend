// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from './HomePage';
import ProductListPage from './ProductListPage';
import FavoritesPage from './FavoritesPage';
import LoginPage from './LoginPage'; // Import LoginPage
import PrivateRoute from '../components/PrivateRoute';
import CartRoutes from '../routes/CartRoutes';
import FooterRoutes from '../routes/FooterRoutes';  // Import FooterRoutes
import AdminPage from './AdminPage';
import ProductManagerPage from './ProductManagerPage';
import SalesManagerPage from './SalesManagerPage';
import CustomerPage from './CustomerPage';
import '../styles/App.css';

const App = () => {
    return (
        <Router>
            <Header />
            <div className="content"> {/* Wrapper to handle page content styling */}
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/login" element={<LoginPage />} />  {/* Add LoginPage route here */}

                    {/* Protected routes */}
                    <Route path="/" element={<HomePage />} />  {/* HomePage for Customer */}
                    <Route path="/login" element={<LoginPage />} />  {/* LoginPage */}
                    <Route path="/sales-manager" element={<SalesManagerPage />} />  {/* Sales Manager Page */}
                    <Route path="/product-manager" element={<ProductManagerPage />} />  {/* Product Manager Page */}

                    {/* Footer-related routes */}
                    <Route path="/footer/*" element={<FooterRoutes />} />

                    {/* Cart-related routes */}
                    <Route path="/cart/*" element={<CartRoutes />} />

                    {/* Redirect unmatched routes */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
            <Footer /> {/* Add Footer here to display it on all pages */}
        </Router>
    );
};

export default App;
