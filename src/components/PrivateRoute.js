

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PrivateRoute = ({ component: Component, allowedRoles }) => {
    const { user } = useUser();

    if (!user.isAuthenticated || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;  // Redirect to login if not authenticated or authorized
    }

    return <Component />;  // Render the component if authorized
};

export default PrivateRoute;
