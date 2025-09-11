'use client';

import { useState } from 'react';

// Mock data and types for admin functionality
interface Match {
  id: string;
  withdrawalId: string;
  depositId: string;
  amount: number;
  status: 'pending' | 'admin_review' | 'approved' | 'rejected' | 'completed';
  adminApproved: boolean;
  createdAt: Date;
  withdrawalUser: {
    id: string;
    name: string;
    bankDetails: {
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
      bankName: string;
    };
  };
  depositUser: {
    id: string;
    name: string;
    bankDetails: {
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
      bankName: string;
    };
  };
  receipt?: {
    id: string;
    matchId: string;
    utrNumber: string;
    receiptUrl: string;
    uploadedAt: Date;
    verified: boolean;
  };
}

// Mock pending matches data
const mockPendingMatches: Match[] = [
  {
    id: 'm1',
    withdrawalId: 'w1',
    depositId: 'd1',
    amount: 25000,
    status: 'admin_review',
    adminApproved: false,
    createdAt: new Date('2024-01-15T10:30:00'),
    withdrawalUser: {
      id: 'user_123',
      name: 'Rajesh Kumar',
      bankDetails: {
        accountNumber: '1234567890',
        ifscCode: 'HDFC0001234',
        accountHolderName: 'Rajesh Kumar',
        bankName: 'HDFC Bank'
      }
    },
    depositUser: {
      id: 'user_456',
      name: 'Priya Sharma',
      bankDetails: {
        accountNumber: '9876543210',
        ifscCode: 'ICIC0005678',
        accountHolderName: 'Priya Sharma',
        bankName: 'ICICI Bank'
      }
    },
    receipt: {
      id: 'r1',
      matchId: 'm1',
      utrNumber: 'UTR123456789',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300',
      uploadedAt: new Date('2024-01-15T14:20:00'),
      verified: false
    }
  },
  {
    id: 'm2',
    withdrawalId: 'w2',
    depositId: 'd2',
    amount: 15000,
    status: 'admin_review',
    adminApproved: false,
    createdAt: new Date('2024-01-14T16:45:00'),
    withdrawalUser: {
      id: 'user_789',
      name: 'Amit Patel',
      bankDetails: {
        accountNumber: '5555666677',
        ifscCode: 'SBIN0009012',
        accountHolderName: 'Amit Patel',
        bankName: 'SBI Bank'
      }
    },
    depositUser: {
      id: 'user_101',
      name: 'Kavya Singh',
      bankDetails: {
        accountNumber: '3333444455',
        ifscCode: 'AXIS0003456',
        accountHolderName: 'Kavya Singh',
        bankName: 'Axis Bank'
      }
    },
    receipt: {
      id: 'r2',
      matchId: 'm2',
      utrNumber: 'UTR987654321',
      receiptUrl: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300',
      uploadedAt: new Date('2024-01-14T18:30:00'),
      verified: false
    }
  }
];

export default function AdminDashboard() {
  const [matches, setMatches] = useState<Match[]>(mockPendingMatches);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const formatINR = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleApprove = async (matchId: string, action: 'approve' | 'reject') => {
    setIsApproving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMatches(prev => prev.map(match => 
        match.id === matchId 
          ? { 
              ...match, 
              status: action === 'approve' ? 'approved' : 'rejected',
              adminApproved: action === 'approve'
            }
          : match
      ));
      
      // Show success message
      const message = action === 'approve' ? '✅ Match approved successfully!' : '❌ Match rejected successfully!';
      showToast(message);
      
      setSelectedMatch(null);
      
    } catch (error) {
      showToast('❌ Failed to process request');
    } finally {
      setIsApproving(false);
    }
  };

  const showToast = (message: string) => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      font-weight: 500;
    `;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !match.adminApproved && match.status !== 'rejected';
    if (filter === 'approved') return match.adminApproved;
    return true;
  });

  const stats = {
    totalMatches: matches.length,
    pendingApprovals: matches.filter(m => !m.adminApproved && m.status !== 'rejected').length,
    approvedToday: matches.filter(m => m.adminApproved).length,
    totalVolume: matches.reduce((sum, match) => sum + match.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ⚡ Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Monitor platform activity, approve transactions, and manage users
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Volume</h3>
            <span className="text-2xl">💎</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {formatINR(stats.totalVolume)}
          </div>
          <p className="text-sm text-gray-500 mt-2">Platform total volume</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
            <span className="text-2xl">⏳</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {stats.pendingApprovals}
          </div>
          <p className="text-sm text-gray-500 mt-2">Require your attention</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Approved Today</h3>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {stats.approvedToday}
          </div>
          <p className="text-sm text-gray-500 mt-2">Successful approvals</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Matches</h3>
            <span className="text-2xl">🔗</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalMatches}
          </div>
          <p className="text-sm text-gray-500 mt-2">All time matches</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1 w-fit shadow-sm border">
          {[
            { key: 'all' as const, label: 'All Matches', count: matches.length },
            { key: 'pending' as const, label: 'Pending', count: stats.pendingApprovals },
            { key: 'approved' as const, label: 'Approved', count: stats.approvedToday }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                filter === tab.key 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMatches.map((match) => (
          <div key={match.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Match Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {formatINR(match.amount)}
                  </h3>
                  <p className="text-sm text-gray-500">Match ID: {match.id}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  match.status === 'approved' ? 'bg-green-100 text-green-700' :
                  match.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {match.status.replace('_', ' ')}
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium mb-1">WITHDRAWER</p>
                  <p className="font-semibold text-gray-900">{match.withdrawalUser.name}</p>
                  <p className="text-sm text-gray-600">{match.withdrawalUser.bankDetails.bankName}</p>
                  <p className="text-xs text-gray-500">{match.withdrawalUser.bankDetails.accountNumber}</p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium mb-1">DEPOSITOR</p>
                  <p className="font-semibold text-gray-900">{match.depositUser.name}</p>
                  <p className="text-sm text-gray-600">{match.depositUser.bankDetails.bankName}</p>
                  <p className="text-xs text-gray-500">{match.depositUser.bankDetails.accountNumber}</p>
                </div>
              </div>

              {/* Receipt Info */}
              {match.receipt && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-gray-600 font-medium mb-1">PAYMENT RECEIPT</p>
                  <p className="text-sm font-mono">{match.receipt.utrNumber}</p>
                  <p className="text-xs text-gray-500">
                    Uploaded: {match.receipt.uploadedAt.toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => setSelectedMatch(match)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1"
                  >
                    View Receipt →
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              {!match.adminApproved && match.status !== 'rejected' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(match.id, 'approve')}
                    disabled={isApproving}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isApproving ? 'Processing...' : '✅ Approve'}
                  </button>
                  <button
                    onClick={() => handleApprove(match.id, 'reject')}
                    disabled={isApproving}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isApproving ? 'Processing...' : '❌ Reject'}
                  </button>
                </div>
              )}

              {match.adminApproved && (
                <div className="bg-green-100 text-green-700 py-2 px-4 rounded-lg text-sm font-medium text-center">
                  ✅ Approved
                </div>
              )}

              {match.status === 'rejected' && (
                <div className="bg-red-100 text-red-700 py-2 px-4 rounded-lg text-sm font-medium text-center">
                  ❌ Rejected
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMatches.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-500">No matches require approval right now.</p>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Payment Receipt</h3>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">UTR Number</p>
                  <p className="font-mono text-lg">{selectedMatch.receipt?.utrNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-green-600">{formatINR(selectedMatch.amount)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Receipt Image</p>
                  <img
                    src={selectedMatch.receipt?.receiptUrl}
                    alt="Payment Receipt"
                    className="w-full rounded-lg border"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedMatch.id, 'approve')}
                    disabled={isApproving}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium"
                  >
                    {isApproving ? 'Processing...' : '✅ Approve Match'}
                  </button>
                  <button
                    onClick={() => handleApprove(selectedMatch.id, 'reject')}
                    disabled={isApproving}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium"
                  >
                    {isApproving ? 'Processing...' : '❌ Reject Match'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}