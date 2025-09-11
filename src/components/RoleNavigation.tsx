'use client';

import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types/roles';

export function RoleNavigation() {
  const { userRole, setUserRole, user, permissions } = useAuth();

  const roles: { key: UserRole; label: string; icon: string; color: string }[] = [
    { key: 'user', label: 'User', icon: '👤', color: 'bg-blue-500' },
    { key: 'subadmin', label: 'Sub Admin', icon: '🛠️', color: 'bg-purple-500' },
    { key: 'admin', label: 'Admin', icon: '⚡', color: 'bg-red-500' }
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">P2P Financial Platform</h1>
          
          {/* Current User Info */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
            <span className="text-lg">{roles.find(r => r.key === userRole)?.icon}</span>
            <span className="font-medium text-gray-700">{user?.name}</span>
            <span className="text-sm text-gray-500">({roles.find(r => r.key === userRole)?.label})</span>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Switch Role:</span>
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => setUserRole(role.key)}
                className={`px-3 py-2 text-sm font-medium flex items-center space-x-2 transition-colors ${
                  userRole === role.key
                    ? `${role.color} text-white`
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{role.icon}</span>
                <span>{role.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Permissions Indicator */}
      <div className="max-w-7xl mx-auto mt-3 flex items-center space-x-4 text-xs text-gray-500">
        <span>Permissions:</span>
        {permissions.canCreateDeposit && <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Create Requests</span>}
        {permissions.canViewMatches && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">View Matches</span>}
        {permissions.canManagePayments && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Manage Payments</span>}
        {permissions.canApproveTransactions && <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">Approve Transactions</span>}
        {permissions.canMonitorUsers && <span className="px-2 py-1 bg-red-100 text-red-700 rounded">Monitor All</span>}
      </div>
    </div>
  );
}