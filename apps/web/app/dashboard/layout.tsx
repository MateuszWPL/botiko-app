import { type ReactNode, Suspense } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { SetupWizardProvider } from '../../components/dashboard/SetupWizard';
import { TrialBanner } from '../../components/dashboard/TrialBanner';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Trial/subscription banner — shown globally when trial is ending or expired */}
        <Suspense fallback={null}>
          <TrialBanner />
        </Suspense>
        <main className="flex-1">
          <div className="max-w-5xl mx-auto p-4 md:p-8 pb-20 md:pb-8">{children}</div>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: 'rounded-xl border border-slate-200 shadow-lg font-sans text-sm',
          },
        }}
      />
      {/* Setup wizard — auto-opens for new users, reopenable from sidebar */}
      <SetupWizardProvider />
    </div>
  );
}
