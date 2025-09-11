// User role hierarchy types
export type UserRole = 'user' | 'subadmin' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
  status: 'active' | 'inactive';
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName?: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'matched' | 'partially_matched' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  // Sub Admin can add these fields
  utrNumber?: string;
  paymentScreenshot?: string;
  verifiedBySubAdmin?: boolean;
  subAdminId?: string;
  subAdminNotes?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  bankDetails: BankDetails;
  amount: number;
  remainingAmount: number;
  status: 'pending' | 'matched' | 'partially_matched' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  completionPercentage: number;
  // Payments received (managed by sub admin)
  payments: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  withdrawalId: string;
  depositId: string;
  amount: number;
  utrNumber: string;
  paymentScreenshot: string;
  approvedBySubAdmin: boolean;
  subAdminId: string;
  createdAt: Date;
  approvedAt?: Date;
}

export interface Match {
  id: string;
  withdrawalId: string;
  depositId: string;
  amount: number;
  status: 'pending' | 'subadmin_review' | 'approved' | 'completed';
  createdAt: Date;
  withdrawalUser: User & { bankDetails: BankDetails };
  depositUser: User;
  paymentRecord?: PaymentRecord;
}

export interface RolePermissions {
  canCreateDeposit: boolean;
  canCreateWithdrawal: boolean;
  canViewMatches: boolean;
  canManagePayments: boolean;
  canEditRequests: boolean;
  canApproveTransactions: boolean;
  canMonitorUsers: boolean;
  canMonitorSubAdmins: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  user: {
    canCreateDeposit: true,
    canCreateWithdrawal: true,
    canViewMatches: false,
    canManagePayments: false,
    canEditRequests: false,
    canApproveTransactions: false,
    canMonitorUsers: false,
    canMonitorSubAdmins: false,
  },
  subadmin: {
    canCreateDeposit: false,
    canCreateWithdrawal: false,
    canViewMatches: true,
    canManagePayments: true,
    canEditRequests: true,
    canApproveTransactions: true,
    canMonitorUsers: false,
    canMonitorSubAdmins: false,
  },
  admin: {
    canCreateDeposit: false,
    canCreateWithdrawal: false,
    canViewMatches: true,
    canManagePayments: true,
    canEditRequests: true,
    canApproveTransactions: true,
    canMonitorUsers: true,
    canMonitorSubAdmins: true,
  }
};