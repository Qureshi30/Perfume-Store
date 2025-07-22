import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

// Protected route for users only
export const UserRoute = ({ children }) => {
    const { isLoaded, user } = useUser();

    if (!isLoaded) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

// Protected route for admins only
export const AdminRoute = ({ children }) => {
    const { isLoaded, user } = useUser();

    if (!isLoaded) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    const userRole = user?.publicMetadata?.role;

    if (userRole !== 'admin') {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

// Redirect based on role
export const RoleBasedRedirect = () => {
    const { isLoaded, user } = useUser();

    if (!isLoaded) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    const userRole = user?.publicMetadata?.role;

    if (userRole === 'admin') {
        return <Navigate to="/admin/dashboard" />;
    }

    return <Navigate to="/user/dashboard" />;
};

export const UnauthorizedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
                <a href="/" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Go Home
                </a>
            </div>
        </div>
    );
};
