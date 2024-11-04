import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import HomePage from '../pages/HomePage';
import ProductListPage from '../pages/ProductListPage';
import AdminPage from '../pages/AdminPage';
import ProductManagerPage from '../pages/ProductManagerPage';
import SalesManagerPage from '../pages/SalesManagerPage';
import CustomerPage from '../pages/CustomerPage';
import FavoritesPage from '../pages/FavoritesPage';
import PrivateRoute from '../components/PrivateRoute';
import CartRoutes from '../routes/CartRoutes'; 
import './App.css';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />

                {/* Protected routes */}
                <Route
                    path="/admin"
                    element={<PrivateRoute allowedRoles={['admin']} component={AdminPage} />}
                />
                <Route
                    path="/product-manager"
                    element={<PrivateRoute allowedRoles={['productManager']} component={ProductManagerPage} />}
                />
                <Route
                    path="/sales-manager"
                    element={<PrivateRoute allowedRoles={['salesManager']} component={SalesManagerPage} />}
                />
                <Route
                    path="/customer"
                    element={<PrivateRoute allowedRoles={['customer']} component={CustomerPage} />}
                />

                {/* Cart-related routes */}
                <Route path="/*" element={<CartRoutes />} />

                {/* Redirect unmatched routes */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
