'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, rolePermissions } from '@/types/roles';

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  permissions: typeof rolePermissions.user;
  setUserRole: (role: UserRole) => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for different roles
const mockUsers: Record<UserRole, User> = {
  user: {
    id: 'user_001',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'user',
    phone: '+91 9876543210',
    createdAt: new Date('2024-01-01'),
    status: 'active'
  },
  subadmin: {
    id: 'subadmin_001', 
    name: 'Priya Sharma',
    email: 'priya@p2p.com',
    role: 'subadmin',
    phone: '+91 9876543211',
    createdAt: new Date('2023-12-01'),
    status: 'active'
  },
  admin: {
    id: 'admin_001',
    name: 'Admin Singh',
    email: 'admin@p2p.com', 
    role: 'admin',
    phone: '+91 9876543212',
    createdAt: new Date('2023-11-01'),
    status: 'active'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(mockUsers[userRole]);
  }, [userRole]);

  const permissions = rolePermissions[userRole];
  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      permissions,
      setUserRole,
      isLoggedIn
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}