export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-slate-900 text-white p-4">
        {/* Sidebar — do implementacji w Fazie 1 */}
        <nav>
          <p className="text-sm text-slate-400">Botiko Dashboard</p>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
