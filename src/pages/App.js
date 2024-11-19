import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from './HomePage';
import ProductListPage from './ProductListPage';
import FavoritesPage from './FavoritesPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage'; // Import the SignupPage
import Profile from './Profile';
import SearchResultPage from './SearchResultPage';
import ProductDetailPage from './ProductDetailPage';
import ProductManagerPage from './ProductManagerPage';
import SalesManagerPage from './SalesManagerPage';
import CartRoutes from '../routes/CartRoutes';
import FooterRoutes from '../routes/FooterRoutes';
import CategoryPage from './CategoryPage'; // Import CategoryPage

import '../styles/App.css';

const App = () => {
    return (
        <Router>
            <Header />
            <div className="content"> {/* Page content wrapper */}
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/products/:productId" element={<ProductDetailPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/login" element={<LoginPage />} /> {/* Login route */}
                    <Route path="/signup" element={<SignUpPage />} /> {/* Sign Up route */}
                    <Route path="/search" element={<SearchResultPage />} /> {/* Search Results Page */}
                    <Route path="/profile" element={<Profile />} />

                    {/* Category Page */}
                    <Route path="/categories/:category" element={<CategoryPage />} /> {/* Dynamic category route */}

                    {/* Manager-specific routes */}
                    <Route path="/sales-manager" element={<SalesManagerPage />} />
                    <Route path="/product-manager" element={<ProductManagerPage />} />

                    {/* Nested routes */}
                    <Route path="/cart/*" element={<CartRoutes />} />
                    <Route path="/footer/*" element={<FooterRoutes />} />

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
            <Footer /> {/* Footer displayed on all pages */}
        </Router>
    );
};

export default App;
