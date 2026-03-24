import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
    const { currentUser, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.some(role => currentUser.roles?.includes(role)) && currentUser.username !== 'Manideep') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default PrivateRoute;
