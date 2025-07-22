import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState('');
  const { user: adminUser } = useUser();

  const assignAdminRole = async (userId) => {
    if (!userId) {
      setError('Please enter a valid User ID');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Attempting to assign admin role to user ID:', userId);
    console.log('Current admin user:', adminUser?.id);

    try {
      // Get the token from adminUser
      const token = await adminUser.getToken();
      console.log('Admin token obtained (first few chars):', token.substring(0, 10) + '...');

      const response = await axios.put(
        `http://localhost:5000/api/admin/assign-admin-role/${userId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Admin role assignment response:', response.data);
      setSuccess(`Admin role assigned to user ID: ${userId}`);
      setUserId('');
    } catch (error) {
      console.error('Error assigning admin role:', error.response || error);
      setError(error.response?.data?.message || 'Failed to assign admin role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Assign Admin Role</h3>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="flex gap-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 py-2 px-3"
          />
          <button
            onClick={() => assignAdminRole(userId)}
            disabled={loading || !userId}
            className={`px-4 py-2 rounded-md ${loading || !userId
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
          >
            {loading ? 'Assigning...' : 'Assign Admin Role'}
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          You can find the User ID in the Clerk Dashboard or when a user signs up.
        </p>
      </div>
    </div>
  );
};

export default UserManagement;
