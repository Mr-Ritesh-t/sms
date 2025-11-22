'use client';

import { UserRole } from '@/lib/types';
import React, { createContext, useContext, ReactNode } from 'react';

interface UserRoleContextType {
  role: UserRole | null;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children, role }: { children: ReactNode; role: UserRole | null }) => {
  return (
    <UserRoleContext.Provider value={{ role }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
