import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 lg:ml-72 p-6 pt-24 lg:p-12 lg:pt-16 max-w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
