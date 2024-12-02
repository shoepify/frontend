import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
    const navigate = useNavigate();

    // Retrieve customerId from sessionStorage
    const customerId = sessionStorage.getItem('customerId');

    return (
        <div className="profile-container">
            <h1 className="profile-header">Profile Page</h1>
            <p className="profile-info">
                Welcome to your profile! Here you can view and manage your personal information.
            </p>
            <div className="profile-actions">
                {customerId ? (
                    <>
                        <button
                            className="profile-button"
                            onClick={() => navigate(`/profile/${customerId}`)} // Navigate to ProfileDetails
                        >
                            View Profile
                        </button>
                        <button
                            className="profile-button"
                            onClick={() => navigate(`/orders/${customerId}`)} // Navigate to GetOrders
                        >
                            View Orders
                        </button>
                    </>
                ) : (
                    <p>Please log in to view your profile and orders.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
