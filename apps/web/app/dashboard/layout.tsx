import { type ReactNode, Suspense } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { SetupWizardProvider } from '../../components/dashboard/SetupWizard';
import { TrialBanner } from '../../components/dashboard/TrialBanner';
import { DashboardTopBar } from '../../components/dashboard/topbar/DashboardTopBar';
import { ReviewBadge } from '../../components/dashboard/ReviewBadge';
import { WelcomeTrialModal } from '../../components/dashboard/WelcomeTrialModal';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto pt-14 md:pt-0">
        {/* Trial/subscription banner — shown globally when trial is ending or expired */}
        <Suspense fallback={null}>
          <TrialBanner />
        </Suspense>
        <DashboardTopBar />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1600px] 2xl:max-w-[2000px] min-[2200px]:max-w-[2400px] min-[2800px]:max-w-[2600px] p-4 md:p-8">{children}</div>
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
      <ReviewBadge />
      <WelcomeTrialModal />
    </div>
  );
}
