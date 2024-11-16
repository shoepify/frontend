import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from './HomePage';
import ProductListPage from './ProductListPage';
import FavoritesPage from './FavoritesPage';
import LoginPage from './LoginPage'; // Import LoginPage
import Profile from './Profile'; // Import Profile component
import ProductManagerPage from './ProductManagerPage';
import SalesManagerPage from './SalesManagerPage';
import ProductDetailPage from './ProductDetailPage'; // Import ProductDetailPage
import PrivateRoute from '../components/PrivateRoute'; // Add PrivateRoute logic for protected pages
import CartRoutes from '../routes/CartRoutes'; // Import Cart-related routes
import FooterRoutes from '../routes/FooterRoutes'; // Import Footer-related routes

import '../styles/App.css';

const App = () => {
    return (
        <Router>
            <Header />
            <div className="content"> {/* Wrapper for page content */}
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} /> {/* Home page */}
                    <Route path="/products" element={<ProductListPage />} /> {/* Product List */}
                    <Route path="/favorites" element={<FavoritesPage />} /> {/* Favorites */}
                    <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
                    <Route path="/product/:productId" element={<ProductDetailPage />} /> {/* Product Detail Page */}

                    {/* Protected routes */}
                    <Route
                        path="/sales-manager"
                        element={
                            <PrivateRoute allowedRoles={['Sales Manager']}>
                                <SalesManagerPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/product-manager"
                        element={
                            <PrivateRoute allowedRoles={['Product Manager']}>
                                <ProductManagerPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute allowedRoles={['Customer', 'Admin', 'Sales Manager', 'Product Manager']}>
                                <Profile />
                            </PrivateRoute>
                        }
                    />

                    {/* Footer and cart-related routes */}
                    <Route path="/footer/*" element={<FooterRoutes />} />
                    <Route path="/cart/*" element={<CartRoutes />} />

                    {/* Redirect unmatched routes */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
            <Footer /> {/* Footer for all pages */}
        </Router>
    );
};

export default App;
