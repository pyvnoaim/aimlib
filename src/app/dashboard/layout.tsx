// app/layout.tsx

import React from 'react';
import { ReactNode } from 'react';
import Link from 'next/link';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold">Dashboard</div>
        <ul className="mt-6">
          <li className="p-4 hover:bg-gray-700">
            <Link href="/dashboard/admin">Admin Dashboard</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link href="/dashboard/user">User Dashboard</Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold">Welcome to your Dashboard</h1>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-900 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
