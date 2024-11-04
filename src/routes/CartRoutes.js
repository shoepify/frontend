import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CartPage from '../pages/CartPage'; // Adjust the path if needed
import CheckoutPage from '../pages/CheckoutPage'; // Adjust the path if needed
import PrivateRoute from '../components/PrivateRoute';

const CartRoutes = () => {
    return (
        <Routes>
            {/* Public cart page */}
            <Route path="/cart" element={<CartPage />} />

            {/* Protected checkout page */}
            <Route
                path="/checkout"
                element={<PrivateRoute allowedRoles={['customer']} component={CheckoutPage} />}
            />
        </Routes>
    );
};

export default CartRoutes;
