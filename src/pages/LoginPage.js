import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const [role, setRole] = useState('Dummy User'); // Default role is "Dummy User"
    const navigate = useNavigate();

    // List of roles to toggle through
    const roles = ['Dummy User', 'Customer', 'Admin', 'Sales Manager', 'Product Manager'];

    // Function to toggle through roles sequentially
    const toggleRole = () => {
        const currentIndex = roles.indexOf(role);
        const nextIndex = (currentIndex + 1) % roles.length; // Move to the next role
        const nextRole = roles[nextIndex];
        setRole(nextRole);

        // Navigate to the appropriate page if the role is not "Dummy User"
        if (nextRole !== 'Dummy User') {
            switch (nextRole) {
                case 'Customer':
                    navigate('/');  // Redirect to HomePage for Customer
                    break;
                case 'Admin':
                    navigate('/admin');  // Redirect to AdminPage
                    break;
                case 'Sales Manager':
                    navigate('/sales-manager');  // Redirect to SalesManagerPage
                    break;
                case 'Product Manager':
                    navigate('/product-manager');  // Redirect to ProductManagerPage
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <div className="login-container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2>Role Selection</h2>
                    <div className="form-group mb-3">
                        <label>Current Role</label>
                        <p className="form-control">{role}</p>
                    </div>

                    {/* Button to toggle role */}
                    <button
                        onClick={toggleRole}
                        className="btn btn-secondary w-100 mt-3"
                    >
                        Change Role
                    </button>

                    {/* Message about the current role */}
                    <p className="text-center mt-3">
                        {role === 'Dummy User'
                            ? 'You are not logged in. Press the button to change roles.'
                            : `You are logged in as: ${role}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
