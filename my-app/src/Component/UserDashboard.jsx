import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        if (isLoaded && !user) {
            navigate('/login');
        }
    }, [isLoaded, user, navigate]);

    if (!isLoaded || !user) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Account</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                    <p className="text-gray-600 mb-4">View your order history and track current orders</p>
                    <a href="/user/orders" className="text-purple-600 hover:text-purple-800">View Orders →</a>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">My Profile</h2>
                    <p className="text-gray-600 mb-4">Update your personal information and preferences</p>
                    <a href="/user/profile" className="text-purple-600 hover:text-purple-800">Edit Profile →</a>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
                    <p className="text-gray-600 mb-4">View and manage your saved items</p>
                    <a href="/user/wishlist" className="text-purple-600 hover:text-purple-800">View Wishlist →</a>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
