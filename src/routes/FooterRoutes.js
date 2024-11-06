// src/routes/FooterRoutes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

const FooterRoutes = () => {
    return (
        <Routes>
            {/* Login page route */}
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
};

export default FooterRoutes;
