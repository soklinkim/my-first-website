import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  PlusIcon, 
  EyeIcon, 
  HeartIcon, 
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Active Listings', value: '12', icon: EyeIcon, color: 'bg-blue-500' },
    { name: 'Total Views', value: '1,234', icon: ChartBarIcon, color: 'bg-green-500' },
    { name: 'Favorites', value: '45', icon: HeartIcon, color: 'bg-red-500' },
    { name: 'Messages', value: '8', icon: ChatBubbleLeftRightIcon, color: 'bg-purple-500' },
  ];

  const quickActions = [
    { name: 'Post New Item', href: '/post-item', icon: PlusIcon, color: 'bg-purple-600' },
    { name: 'View Messages', href: '/messages', icon: ChatBubbleLeftRightIcon, color: 'bg-blue-600' },
    { name: 'My Favorites', href: '/favorites', icon: HeartIcon, color: 'bg-red-600' },
    { name: 'Browse Items', href: '/items', icon: EyeIcon, color: 'bg-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your DropLink account
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className={`${action.color} p-2 rounded-lg`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-500 p-2 rounded-full">
                <CurrencyDollarIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Your item "Vintage Camera" received a new message</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-500 p-2 rounded-full">
                <HeartIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Someone liked your "Vintage Leather Sofa"</p>
                <p className="text-sm text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-purple-500 p-2 rounded-full">
                <PlusIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">You posted a new item "Designer Sneakers"</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;