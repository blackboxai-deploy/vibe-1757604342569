'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const { userRole, permissions } = useAuth();

  const getRoleBasedContent = () => {
    switch (userRole) {
      case 'user':
        return {
          title: 'User Dashboard',
          description: 'Create deposit and withdrawal requests',
          link: '/user',
          icon: '👤',
          color: 'blue'
        };
      case 'subadmin':
        return {
          title: 'Sub Admin Dashboard', 
          description: 'Manage requests, add payment details, and process transactions',
          link: '/subadmin',
          icon: '🛠️',
          color: 'purple'
        };
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'Monitor platform activity, approve transactions, and manage users',
          link: '/admin', 
          icon: '⚡',
          color: 'red'
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Access your platform features',
          link: '/user',
          icon: '👤',
          color: 'blue'
        };
    }
  };

  const content = getRoleBasedContent();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            💰 P2P Financial Matching Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Role-based platform with User → Sub Admin → Admin hierarchy for secure P2P financial transactions
          </p>
        </div>

        {/* Current Role Dashboard */}
        <div className="mb-12">
          <Link href={content.link} className="group block">
            <div className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-${content.color}-200 max-w-2xl mx-auto`}>
              <div className="text-center">
                <div className={`w-16 h-16 bg-${content.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-${content.color}-200 transition-colors`}>
                  <span className="text-3xl">{content.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h3>
                <p className="text-gray-600 mb-4">{content.description}</p>
                <div className={`inline-flex items-center text-${content.color}-600 font-semibold`}>
                  Access Dashboard →
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Role Hierarchy */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Platform Hierarchy
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">User</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Create deposit requests</li>
                <li>• Create withdrawal requests</li>
                <li>• Provide bank details</li>
                <li>• Cannot see matches</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Sub Admin</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• View all requests</li>
                <li>• Add UTR & payment screenshots</li>
                <li>• Edit withdrawal amounts</li>
                <li>• Process partial payments</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Admin</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Monitor all users & sub admins</li>
                <li>• Final approval authority</li>
                <li>• Platform analytics</li>
                <li>• System management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Permissions */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-blue-900 mb-3">Your Current Permissions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {permissions.canCreateDeposit && (
              <div className="bg-white px-3 py-2 rounded-lg border">
                <span className="text-green-600">✅</span> Create Requests
              </div>
            )}
            {permissions.canViewMatches && (
              <div className="bg-white px-3 py-2 rounded-lg border">
                <span className="text-blue-600">✅</span> View Matches
              </div>
            )}
            {permissions.canManagePayments && (
              <div className="bg-white px-3 py-2 rounded-lg border">
                <span className="text-purple-600">✅</span> Manage Payments
              </div>
            )}
            {permissions.canApproveTransactions && (
              <div className="bg-white px-3 py-2 rounded-lg border">
                <span className="text-orange-600">✅</span> Approve Transactions
              </div>
            )}
            {permissions.canMonitorUsers && (
              <div className="bg-white px-3 py-2 rounded-lg border">
                <span className="text-red-600">✅</span> Monitor All Users
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            System Online - All Roles Functional
          </div>
        </div>
      </div>
    </div>
  );
}