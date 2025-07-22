import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const [showUserManagement, setShowUserManagement] = useState(false);

    useEffect(() => {
        // Check if user data is loaded and redirect non-admin users
        if (isLoaded) {
            console.log('User loaded:', user);
            console.log('User metadata:', user?.publicMetadata);
            console.log('User role:', user?.publicMetadata?.role);

            const userRole = user?.publicMetadata?.role;
            if (userRole !== 'admin') {
                console.log('Not an admin, redirecting...');
                navigate('/');
            } else {
                console.log('Admin access granted!');
            }
        }
    }, [isLoaded, user, navigate]);

    if (!isLoaded || !user) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => setShowUserManagement(!showUserManagement)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                    {showUserManagement ? 'Back to Dashboard' : 'User Management'}
                </button>
            </div>

            {showUserManagement ? (
                <UserManagement />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Product Management</h2>
                        <p className="text-gray-600 mb-4">Add, edit, or remove products from your inventory</p>
                        <a href="/add-product" className="text-purple-600 hover:text-purple-800">Add Products →</a>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Order Management</h2>
                        <p className="text-gray-600 mb-4">View and process customer orders</p>
                        <a href="/admin/orders" className="text-purple-600 hover:text-purple-800">Manage Orders →</a>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">User Management</h2>
                        <p className="text-gray-600 mb-4">View and manage user accounts, assign admin roles</p>
                        <button
                            onClick={() => setShowUserManagement(true)}
                            className="text-purple-600 hover:text-purple-800"
                        >
                            Manage Users →
                        </button>
                    </div>

                    {/* <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Register Admin</h2>
                        <p className="text-gray-600 mb-4">Create a new admin account for the store</p>
                        <a href="/admin/register" className="text-purple-600 hover:text-purple-800">Register Admin →</a>
                    </div> */}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
