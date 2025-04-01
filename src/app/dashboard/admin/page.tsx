// app/dashboard/admin/page.tsx

import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      <p>
        Welcome to the admin panel. Here you can manage users, settings, etc.
      </p>

      {/* Example Admin Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-600 p-6 rounded-lg shadow-md hover:bg-gray-800">
          <h3 className="text-lg font-medium">User Management</h3>
          <p>Manage all users here.</p>
        </div>
        <div className="bg-gray-600 p-6 rounded-lg shadow-md hover:bg-gray-800">
          <h3 className="text-lg font-medium">Settings</h3>
          <p>Update application settings.</p>
        </div>
        <div className="bg-gray-600 p-6 rounded-lg shadow-md hover:bg-gray-800">
          <h3 className="text-lg font-medium">Analytics</h3>
          <p>View system analytics and performance.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
