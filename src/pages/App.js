import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
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

const App = () => {
    const { userRole } = useUser(); // Get the current role
    const [loading, setLoading] = useState(true); // Loading state for session handling

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.clear(); // Clear all data in localStorage
        };

        // Add the event listener
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    
    useEffect(() => {
        const fetchSessionId = async () => {
            try {
                const response = await fetch("http://localhost:8000/session-id/", {
                    method: "GET",
                    credentials: "include", // Include cookies with the request
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch session ID");
                }
    
                const data = await response.json();
                console.log("Session Response:", data);
    
                // Store the session ID if available
                if (data.session_id) {
                    localStorage.setItem("session_id", data.session_id);
                    console.log("Session ID stored:", data.session_id);
                } else {
                    console.warn("Session ID not found in response");
                }
            } catch (error) {
                console.error("Error fetching session ID:", error);
            } finally {
                // Ensure loading is set to false in all cases
                setLoading(false);
            }
        };
    
        fetchSessionId();
    }, []);
    

    // Render loading screen while fetching session ID
    if (loading) {
        return <div>Loading session...</div>;
    }

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
