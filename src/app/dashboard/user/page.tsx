// app/dashboard/user/page.tsx

import React from 'react';

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">User Dashboard</h2>
      <p>
        Welcome to your user dashboard. Here you can view your profile,
        activities, etc.
      </p>

      {/* Example User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-600 p-6 rounded-lg shadow-md hover:bg-gray-800">
          <h3 className="text-lg font-medium">Profile</h3>
          <p>View and edit your profile information.</p>
        </div>
        <div className="bg-gray-600 p-6 rounded-lg shadow-md hover:bg-gray-800">
          <h3 className="text-lg font-medium">My Activities</h3>
          <p>Track your recent activities.</p>
        </div>
        <div className="bg-gray-600 p-6 rounded-lg shadow-md hover:bg-gray-800">
          <h3 className="text-lg font-medium">Settings</h3>
          <p>Manage your account settings.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
