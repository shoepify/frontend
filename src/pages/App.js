import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GuestHeader from "../components/headers/GuestHeader";
import CustomerHeader from "../components/headers/CustomerHeader";
import SalesManagerHeader from "../components/headers/SalesManagerHeader";
import ProductManagerHeader from "../components/headers/ProductManagerHeader";
import AdminHeader from "../components/headers/AdminHeader";
import Footer from "../components/Footer";
import HomePage from "./HomePage";
import FavoritesPage from "./FavoritesPage";
import CartPage from "./CartPage";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import Profile from "./Profile";
import SearchResultPage from "./SearchResultPage";
import ProductDetailPage from "./ProductDetailPage";
import FooterRoutes from "../routes/FooterRoutes";
import CategoryPage from "./CategoryPage";
import "../styles/App.css";
import { useUser } from "../context/UserContext";
import ProductManagerProductPage from "./ProductManagerProductPage";
import AddProductPage from "./AddProductPage";
import ProductManagerComments from "./ProductManagerComments";
import ApprovedComments from "./ApprovedComments";
import ProfileDetails from "./ProfileDetail"; // Import the ProfileDetails component
import GetOrders from "./GetOrders"; // Import the GetOrders component
import ProductManagerOrders from "./ProductManagerOrders";

const App = () => {
    const { userRole } = useUser(); // Get the current role

    // Select the appropriate header based on the user role
    const renderHeader = () => {
        switch (userRole) {
            case "guest":
                return <GuestHeader />;
            case "customer":
                return <CustomerHeader />;
            case "sales_manager":
                return <SalesManagerHeader />;
            case "product_manager":
                return <ProductManagerHeader />;
            case "admin":
                return <AdminHeader />;
            default:
                return <GuestHeader />; // Default to GuestHeader
        }
    };

    // Define common routes for all users
    const commonRoutes = (
        <>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/search" element={<SearchResultPage />} />
            <Route path="/categories/:category" element={<CategoryPage />} />
            <Route path="/products/:productId/comments" element={<ApprovedComments />} />
            <Route path="/footer/*" element={<FooterRoutes />} />
            <Route path="*" element={<Navigate to="/" />} />
        </>
    );

    return (
        <Router>
            {renderHeader()} {/* Render the appropriate header */}
            <div className="content">
                <Routes>
                    {/* Guest Routes */}
                    {userRole === "guest" && (
                        <>
                            {commonRoutes}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/profile" element={<Profile />} />
                        </>
                    )}

                    {/* Customer Routes */}
                    {userRole === "customer" && (
                        <>
                            {commonRoutes}
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/profile/:customerId" element={<ProfileDetails />} /> {/* ProfileDetails route for customers */}
                            <Route path="/orders/:customerId" element={<GetOrders />} /> {/* Orders route */}
                        </>
                    )}

                    {/* Sales Manager Routes */}
                    {userRole === "sales_manager" && (
                        <>
                            {commonRoutes}
                            <Route path="/" element={<div>You are a Sales Manager now.</div>} />
                        </>
                    )}

                    {/* Product Manager Routes */}
                    {userRole === "product_manager" && (
                        <>
                            {commonRoutes}
                            <Route path="/" element={<div>You are a Product Manager now.</div>} />
                            <Route path="/manage-products" element={<ProductManagerProductPage />} />
                            <Route path="/manage-products/add" element={<AddProductPage />} />
                            <Route path="/comments" element={<ProductManagerComments />} />
                            <Route path="/product_manager/orders" element={<ProductManagerOrders />} />
                        </>
                    )}

                    {/* Admin Routes */}
                    {userRole === "admin" && (
                        <>
                            {commonRoutes}
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
