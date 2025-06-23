'use client';

import { ReactNode } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
}