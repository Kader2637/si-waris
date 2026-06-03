import { Settings, Shield, Bell, Database } from "lucide-react";

export default function SettingsPage() {
  const sections = [
    { title: "Profil Pengguna", desc: "Kelola informasi akun Anda.", icon: Shield },
    { title: "Notifikasi", desc: "Atur preferensi pemberitahuan.", icon: Bell },
    { title: "Koneksi Database", desc: "Konfigurasi PostgreSQL & Prisma.", icon: Database },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pengaturan</h1>
        <p className="text-slate-500 mt-1 font-medium text-xs">Konfigurasi sistem, keamanan, dan preferensi admin panel.</p>
      </div>

      <div className="space-y-4">
        {sections.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md shadow-slate-200/20 flex items-center justify-between group hover:border-emerald-200 transition-all cursor-pointer">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                   <s.icon size={20} />
                </div>
                <div>
                   <h3 className="text-base font-black text-slate-900">{s.title}</h3>
                   <p className="text-slate-500 font-medium text-xs">{s.desc}</p>
                </div>
             </div>
             <div className="p-2.5 bg-slate-50 rounded-lg text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Settings size={16} />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
