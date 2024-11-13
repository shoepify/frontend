import React from 'react';
import '../styles/Profile.css'; // Import the CSS file

const Profile = () => {
    return (
        <div className="profile-container">
            <h1 className="profile-header">Profile Page</h1>
            <p className="profile-info">
                Welcome to your profile! Here you can view and manage your personal information.
            </p>
            <div className="profile-actions">
                <button className="profile-button">Edit Profile</button>
                <button className="profile-button">View Orders</button>
            </div>
        </div>
    );
};

export default Profile;
