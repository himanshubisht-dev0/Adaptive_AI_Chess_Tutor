import React, { useState } from 'react';
import { StatsDashboard } from '../components/StatsDashboard';

export const Profile: React.FC = () => {
  const [userId] = useState('user_123'); // In real app, this would come from auth

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">U</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
              <p className="text-gray-600">Track your chess learning journey</p>
              <div className="flex space-x-4 mt-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Beginner
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Active Learner
                </span>
              </div>
            </div>
          </div>
        </div>

        <StatsDashboard userId={userId} />
      </div>
    </div>
  );
};
