'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { DepositRequest, WithdrawalRequest } from '@/types/roles';

const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Mock data for Sub Admin view
const mockDepositRequests: DepositRequest[] = [
  {
    id: 'dep_001',
    userId: 'user_001',
    userName: 'Rajesh Kumar',
    amount: 25000,
    status: 'matched',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    // Can be added by Sub Admin
    utrNumber: undefined,
    paymentScreenshot: undefined,
    verifiedBySubAdmin: false
  },
  {
    id: 'dep_002',
    userId: 'user_002',
    userName: 'Amit Patel',
    amount: 15000,
    status: 'partially_matched',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    utrNumber: 'UTR123456789',
    paymentScreenshot: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300',
    verifiedBySubAdmin: true,
    subAdminId: 'subadmin_001',
    subAdminNotes: 'Payment verified and approved'
  }
];

const mockWithdrawalRequests: WithdrawalRequest[] = [
  {
    id: 'with_001',
    userId: 'user_003',
    userName: 'Priya Sharma',
    bankDetails: {
      accountName: 'Priya Sharma',
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank'
    },
    amount: 50000,
    remainingAmount: 30000,
    status: 'partially_matched',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-15'),
    completionPercentage: 40,
    payments: [
      {
        id: 'pay_001',
        withdrawalId: 'with_001',
        depositId: 'dep_001',
        amount: 20000,
        utrNumber: 'UTR987654321',
        paymentScreenshot: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300',
        approvedBySubAdmin: true,
        subAdminId: 'subadmin_001',
        createdAt: new Date('2024-01-14'),
        approvedAt: new Date('2024-01-14')
      }
    ]
  },
  {
    id: 'with_002',
    userId: 'user_004',
    userName: 'Kavya Singh',
    bankDetails: {
      accountName: 'Kavya Singh',
      accountNumber: '9876543210',
      ifscCode: 'ICIC0005678',
      bankName: 'ICICI Bank'
    },
    amount: 30000,
    remainingAmount: 30000,
    status: 'pending',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    completionPercentage: 0,
    payments: []
  }
];

export default function SubAdminDashboard() {
  const { permissions } = useAuth();
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');
  const [selectedDeposit, setSelectedDeposit] = useState<DepositRequest | null>(null);
  const [editingWithdrawal, setEditingWithdrawal] = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState('');
  
  // Form states for deposit editing
  const [depositForm, setDepositForm] = useState({
    utrNumber: '',
    paymentScreenshot: null as File | null,
    notes: ''
  });

  const [deposits] = useState<DepositRequest[]>(mockDepositRequests);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(mockWithdrawalRequests);

  const handleDepositUpdate = async () => {
    if (!depositForm.utrNumber.trim()) {
      alert('Please enter UTR number');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('✅ Deposit request updated successfully!');
      setSelectedDeposit(null);
      setDepositForm({ utrNumber: '', paymentScreenshot: null, notes: '' });
      
    } catch (error) {
      alert('❌ Failed to update deposit request');
    }
  };

  const handleWithdrawalAmountUpdate = async (withdrawalId: string) => {
    const amount = parseInt(newAmount.replace(/[^0-9]/g, ''));
    if (!amount || amount < 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // Update withdrawal amount
      setWithdrawals(prev => prev.map(w => 
        w.id === withdrawalId 
          ? { 
              ...w, 
              remainingAmount: amount,
              completionPercentage: ((w.amount - amount) / w.amount) * 100,
              updatedAt: new Date()
            }
          : w
      ));
      
      alert('✅ Withdrawal amount updated successfully!');
      setEditingWithdrawal(null);
      setNewAmount('');
      
    } catch (error) {
      alert('❌ Failed to update withdrawal amount');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      'matched': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Matched' },
      'partially_matched': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Partially Matched' },
      'completed': { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (!permissions.canViewMatches) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl mb-4 block">🚫</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🛠️ Sub Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage deposit and withdrawal requests, add payment details, and process transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Deposits</h3>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatINR(deposits.reduce((sum, d) => sum + d.amount, 0))}
          </div>
          <p className="text-sm text-gray-500 mt-2">{deposits.length} requests</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Withdrawals</h3>
            <span className="text-2xl">💸</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {formatINR(withdrawals.reduce((sum, w) => sum + w.amount, 0))}
          </div>
          <p className="text-sm text-gray-500 mt-2">{withdrawals.length} requests</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Processing</h3>
            <span className="text-2xl">⏳</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {deposits.filter(d => !d.verifiedBySubAdmin).length + withdrawals.filter(w => w.status === 'pending').length}
          </div>
          <p className="text-sm text-gray-500 mt-2">Require attention</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Completed Today</h3>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {deposits.filter(d => d.verifiedBySubAdmin).length}
          </div>
          <p className="text-sm text-gray-500 mt-2">Processed by you</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-white rounded-lg p-1 w-fit shadow-sm border">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'deposits'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>💰</span>
            Deposit Requests ({deposits.length})
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'withdrawals'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>💸</span>
            Withdrawal Requests ({withdrawals.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'deposits' ? (
        /* Deposit Requests */
        <div className="space-y-6">
          {deposits.map((deposit) => (
            <div key={deposit.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {formatINR(deposit.amount)}
                  </h3>
                  <p className="text-gray-600">{deposit.userName}</p>
                  <p className="text-sm text-gray-500">
                    Request ID: {deposit.id} • Created: {deposit.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(deposit.status)}
                  {deposit.verifiedBySubAdmin && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      ✅ Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              {deposit.utrNumber ? (
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-green-900 mb-2">Payment Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-600">UTR Number</p>
                      <p className="font-mono font-semibold">{deposit.utrNumber}</p>
                    </div>
                    {deposit.paymentScreenshot && (
                      <div>
                        <p className="text-sm text-green-600">Payment Screenshot</p>
                        <img 
                          src={deposit.paymentScreenshot} 
                          alt="Payment Screenshot" 
                          className="w-24 h-24 object-cover rounded border cursor-pointer"
                          onClick={() => window.open(deposit.paymentScreenshot, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                  {deposit.subAdminNotes && (
                    <div className="mt-3">
                      <p className="text-sm text-green-600">Notes</p>
                      <p className="text-sm">{deposit.subAdminNotes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSelectedDeposit(deposit)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  ➕ Add Payment Details
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Withdrawal Requests */
        <div className="space-y-6">
          {withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {formatINR(withdrawal.amount)}
                  </h3>
                  <p className="text-gray-600">{withdrawal.userName}</p>
                  <p className="text-sm text-gray-500">
                    Request ID: {withdrawal.id} • Created: {withdrawal.createdAt.toLocaleDateString()}
                  </p>
                </div>
                {getStatusBadge(withdrawal.status)}
              </div>

              {/* Bank Details */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">Bank Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600">Account Name</p>
                    <p className="font-semibold">{withdrawal.bankDetails.accountName}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Account Number</p>
                    <p className="font-mono font-semibold">{withdrawal.bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">IFSC Code</p>
                    <p className="font-mono font-semibold">{withdrawal.bankDetails.ifscCode}</p>
                  </div>
                </div>
              </div>

              {/* Progress and Amount Management */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Progress</span>
                  <span className="text-sm font-semibold">{withdrawal.completionPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${withdrawal.completionPercentage}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-semibold text-lg">{formatINR(withdrawal.amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Paid Amount</p>
                    <p className="font-semibold text-green-600 text-lg">
                      {formatINR(withdrawal.amount - withdrawal.remainingAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Remaining Amount</p>
                    <div className="flex items-center space-x-2">
                      {editingWithdrawal === withdrawal.id ? (
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <span className="absolute left-2 top-2 text-gray-500 text-sm">₹</span>
                            <input
                              type="text"
                              value={newAmount}
                              onChange={(e) => setNewAmount(e.target.value.replace(/[^0-9]/g, ''))}
                              className="pl-6 pr-2 py-1 border rounded text-sm w-24"
                            />
                          </div>
                          <button
                            onClick={() => handleWithdrawalAmountUpdate(withdrawal.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => {
                              setEditingWithdrawal(null);
                              setNewAmount('');
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                          >
                            ❌
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold text-blue-600 text-lg">
                            {formatINR(withdrawal.remainingAmount)}
                          </p>
                          {withdrawal.remainingAmount > 0 && (
                            <button
                              onClick={() => {
                                setEditingWithdrawal(withdrawal.id);
                                setNewAmount(withdrawal.remainingAmount.toString());
                              }}
                              className="text-blue-600 hover:text-blue-700 text-xs"
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              {withdrawal.payments.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment History</h4>
                  <div className="space-y-3">
                    {withdrawal.payments.map((payment) => (
                      <div key={payment.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{formatINR(payment.amount)}</p>
                            <p className="text-sm text-gray-600">UTR: {payment.utrNumber}</p>
                            <p className="text-xs text-gray-500">
                              {payment.createdAt.toLocaleDateString()} 
                              {payment.approvedAt && ` • Approved: ${payment.approvedAt.toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {payment.paymentScreenshot && (
                              <img 
                                src={payment.paymentScreenshot} 
                                alt="Payment Screenshot" 
                                className="w-12 h-12 object-cover rounded border cursor-pointer"
                                onClick={() => window.open(payment.paymentScreenshot, '_blank')}
                              />
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.approvedBySubAdmin 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {payment.approvedBySubAdmin ? '✅ Approved' : '⏳ Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Deposit Payment Details Modal */}
      {selectedDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Add Payment Details</h3>
                <button
                  onClick={() => setSelectedDeposit(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Deposit Request</p>
                  <p className="text-xl font-bold">{formatINR(selectedDeposit.amount)}</p>
                  <p className="text-gray-600">{selectedDeposit.userName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UTR Number *
                  </label>
                  <input
                    type="text"
                    value={depositForm.utrNumber}
                    onChange={(e) => setDepositForm(prev => ({ ...prev, utrNumber: e.target.value }))}
                    placeholder="Enter UTR number"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Screenshot
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDepositForm(prev => ({ 
                      ...prev, 
                      paymentScreenshot: e.target.files?.[0] || null 
                    }))}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={depositForm.notes}
                    onChange={(e) => setDepositForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes about this payment"
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleDepositUpdate()}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium"
                  >
                    ✅ Save Payment Details
                  </button>
                  <button
                    onClick={() => setSelectedDeposit(null)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium"
                  >
                    Cancel
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