import { type ReactNode } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* pb-20 on mobile leaves room for the fixed bottom nav */}
        <div className="max-w-5xl mx-auto p-4 md:p-8 pb-20 md:pb-8">{children}</div>
      </main>
    </div>
  );
}
