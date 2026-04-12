import { type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from '../../components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* pb-20 on mobile leaves room for the fixed bottom nav */}
        <div className="max-w-5xl mx-auto p-4 md:p-8 pb-20 md:pb-8">{children}</div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: 'rounded-xl border border-slate-200 shadow-lg font-sans text-sm',
          },
        }}
      />
    </div>
  );
}
