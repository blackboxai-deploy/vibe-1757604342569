'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { BankDetails } from '@/types/roles';

const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export default function UserDashboard() {
  const { user, permissions } = useAuth();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdrawal'>('deposit');
  
  // Deposit form state
  const [depositAmount, setDepositAmount] = useState('');
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);
  
  // Withdrawal form state
  const [withdrawalForm, setWithdrawalForm] = useState({
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    amount: ''
  });
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);
  
  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateDepositAmount = (amount: string): boolean => {
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''));
    if (!numAmount || numAmount < 100) {
      setErrors({ amount: 'Minimum deposit amount is ₹100' });
      return false;
    }
    if (numAmount > 500000) {
      setErrors({ amount: 'Maximum deposit amount is ₹5,00,000' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateWithdrawal = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!withdrawalForm.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }
    
    if (!withdrawalForm.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (withdrawalForm.accountNumber.length < 9 || withdrawalForm.accountNumber.length > 18) {
      newErrors.accountNumber = 'Account number must be 9-18 digits';
    }
    
    if (!withdrawalForm.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(withdrawalForm.ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'Invalid IFSC code format';
    }
    
    const amount = parseInt(withdrawalForm.amount.replace(/[^0-9]/g, ''));
    if (!amount || amount < 100) {
      newErrors.amount = 'Minimum withdrawal amount is ₹100';
    } else if (amount > 500000) {
      newErrors.amount = 'Maximum withdrawal amount is ₹5,00,000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDepositSubmit = async () => {
    if (!validateDepositAmount(depositAmount)) return;
    
    setIsSubmittingDeposit(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert(`✅ Deposit request for ${formatINR(parseInt(depositAmount))} submitted successfully!`);
      
      // Reset form
      setDepositAmount('');
      
    } catch (error) {
      alert('❌ Failed to submit deposit request');
    } finally {
      setIsSubmittingDeposit(false);
    }
  };

  const handleWithdrawalSubmit = async () => {
    if (!validateWithdrawal()) return;
    
    setIsSubmittingWithdrawal(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert(`✅ Withdrawal request for ${formatINR(parseInt(withdrawalForm.amount))} submitted successfully!`);
      
      // Reset form
      setWithdrawalForm({
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        amount: ''
      });
      
    } catch (error) {
      alert('❌ Failed to submit withdrawal request');
    } finally {
      setIsSubmittingWithdrawal(false);
    }
  };

  const handleAmountChange = (value: string, type: 'deposit' | 'withdrawal') => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (type === 'deposit') {
      setDepositAmount(cleanValue);
    } else {
      setWithdrawalForm(prev => ({ ...prev, amount: cleanValue }));
    }
  };

  if (!permissions.canCreateDeposit && !permissions.canCreateWithdrawal) {
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
          👤 User Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Create deposit and withdrawal requests
        </p>
      </div>

      {/* Welcome Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Welcome, {user?.name}!
        </h2>
        <p className="text-gray-600">
          You can create deposit requests (to deposit money) and withdrawal requests (to withdraw money to your bank account).
          Once submitted, our Sub Admin team will process your requests.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-white rounded-lg p-1 w-fit shadow-sm border">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'deposit'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>💰</span>
            Create Deposit Request
          </button>
          <button
            onClick={() => setActiveTab('withdrawal')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'withdrawal'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>💸</span>
            Create Withdrawal Request
          </button>
        </div>
      </div>

      {/* Forms */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'deposit' ? (
          /* Deposit Form */
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Deposit Request</h3>
              <p className="text-gray-600">
                Submit a request to deposit money into the platform
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-500 font-medium text-lg">₹</span>
                  <input
                    type="text"
                    value={depositAmount}
                    onChange={(e) => handleAmountChange(e.target.value, 'deposit')}
                    placeholder="Enter amount (min ₹100)"
                    className={`w-full pl-12 pr-4 py-4 border rounded-lg text-lg font-semibold focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {depositAmount && (
                  <p className="text-sm text-gray-600 mt-2">
                    Amount: <span className="font-semibold">{formatINR(parseInt(depositAmount) || 0)}</span>
                  </p>
                )}
                {errors.amount && (
                  <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
                )}
              </div>

              <button
                onClick={handleDepositSubmit}
                disabled={!depositAmount || isSubmittingDeposit}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg text-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmittingDeposit ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>💰</span>
                    <span>Submit Deposit Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Withdrawal Form */
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💸</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Withdrawal Request</h3>
              <p className="text-gray-600">
                Submit a request to withdraw money to your bank account
              </p>
            </div>

            <div className="space-y-6">
              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={withdrawalForm.accountName}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, accountName: e.target.value }))}
                  placeholder="Enter account holder name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.accountName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.accountName && (
                  <p className="text-sm text-red-500 mt-1">{errors.accountName}</p>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={withdrawalForm.accountNumber}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, accountNumber: e.target.value.replace(/[^0-9]/g, '') }))}
                  placeholder="Enter account number"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.accountNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.accountNumber}</p>
                )}
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  value={withdrawalForm.ifscCode}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                  placeholder="Enter IFSC code (e.g., SBIN0001234)"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ifscCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.ifscCode && (
                  <p className="text-sm text-red-500 mt-1">{errors.ifscCode}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-500 font-medium text-lg">₹</span>
                  <input
                    type="text"
                    value={withdrawalForm.amount}
                    onChange={(e) => handleAmountChange(e.target.value, 'withdrawal')}
                    placeholder="Enter amount (min ₹100)"
                    className={`w-full pl-12 pr-4 py-4 border rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {withdrawalForm.amount && (
                  <p className="text-sm text-gray-600 mt-2">
                    Amount: <span className="font-semibold">{formatINR(parseInt(withdrawalForm.amount) || 0)}</span>
                  </p>
                )}
                {errors.amount && (
                  <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
                )}
              </div>

              <button
                onClick={handleWithdrawalSubmit}
                disabled={isSubmittingWithdrawal}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg text-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmittingWithdrawal ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>💸</span>
                    <span>Submit Withdrawal Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-bold text-blue-900 mb-2">📋 Important Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Deposit requests will be matched with withdrawal requests by our system</li>
            <li>• Withdrawal requests require valid bank account details</li>
            <li>• All requests are processed by our Sub Admin team</li>
            <li>• You will be notified once your request is processed</li>
            <li>• Minimum amount: ₹100, Maximum amount: ₹5,00,000</li>
          </ul>
        </div>
      </div>
    </div>
  );
}