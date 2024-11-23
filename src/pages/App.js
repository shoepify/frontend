import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GuestHeader from '../components/headers/GuestHeader';
import CustomerHeader from '../components/headers/CustomerHeader';
import SalesManagerHeader from '../components/headers/SalesManagerHeader';
import ProductManagerHeader from '../components/headers/ProductManagerHeader';
import AdminHeader from '../components/headers/AdminHeader';
import Footer from '../components/Footer';
import HomePage from './HomePage';
import FavoritesPage from './FavoritesPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import Profile from './Profile';
import SearchResultPage from './SearchResultPage';
import ProductDetailPage from './ProductDetailPage';
import FooterRoutes from '../routes/FooterRoutes';
import CategoryPage from './CategoryPage';
import '../styles/App.css';
import { useUser } from '../context/UserContext';
import ProductManagerProductPage from "./ProductManagerProductPage";

const App = () => {
    const { userRole } = useUser(); // Get the current role

    // Select the appropriate header based on the user role
    const renderHeader = () => {
        switch (userRole) {
            case 'guest':
                return <GuestHeader />;
            case 'customer':
                return <CustomerHeader />;
            case 'sales_manager':
                return <SalesManagerHeader />;
            case 'product_manager':
                return <ProductManagerHeader />;
            case 'admin':
                return <AdminHeader />;
            default:
                return <GuestHeader />; // Default to GuestHeader
        }
    };

    return (
        <Router>
            {renderHeader()} {/* Render the appropriate header */}
            <div className="content">
                <Routes>
                    {/* Guest Routes */}
                    {userRole === 'guest' && (
                        <>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/products/:productId" element={<ProductDetailPage />} />
                            <Route path="/favorites" element={<FavoritesPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/search" element={<SearchResultPage />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/categories/:category" element={<CategoryPage />} />
                            <Route path="/footer/*" element={<FooterRoutes />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    )}

                    {/* Customer Routes */}
                    {userRole === 'customer' && (
                        <>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/favorites" element={<FavoritesPage />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/products/:productId" element={<ProductDetailPage />} />
                            <Route path="/favorites" element={<FavoritesPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/search" element={<SearchResultPage />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/categories/:category" element={<CategoryPage />} />
                            <Route path="/footer/*" element={<FooterRoutes />} />
                            <Route path="*" element={<Navigate to="/" />} />

                        </>
                    )}

                    {/* Sales Manager Routes */}
                    {userRole === 'sales_manager' && (
                        <>
                            <Route path="/" element={<div>You are a Sales Manager now.</div>} />
                        </>
                    )}

                    {/* Product Manager Routes */}
                    {userRole === 'product_manager' && (
                        <>
                            
                            <Route path="/" element={<div>You are a Product Manager now.</div>} />
                            <Route path="/manage-products" element={<ProductManagerProductPage />} />

 
                        </>
                    )}

                    {/* Admin Routes */}
                    {userRole === 'admin' && (
                        <>
                            <Route path="/" element={<div>You are an Admin now.</div>} />
                        </>
                    )}

                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
};

export default App;
