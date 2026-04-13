import { Settings, Shield, Bell, Database } from "lucide-react";

export default function SettingsPage() {
  const sections = [
    { title: "Profil Pengguna", desc: "Kelola informasi akun Anda.", icon: Shield },
    { title: "Notifikasi", desc: "Atur preferensi pemberitahuan.", icon: Bell },
    { title: "Koneksi Database", desc: "Konfigurasi PostgreSQL & Prisma.", icon: Database },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pengaturan</h1>
        <p className="text-slate-500 mt-2 font-medium">Konfigurasi sistem, keamanan, dan preferensi admin panel.</p>
      </div>

      <div className="space-y-6">
        {sections.map((s, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex items-center justify-between group hover:border-emerald-200 transition-all cursor-pointer">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                   <s.icon size={28} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800">{s.title}</h3>
                   <p className="text-slate-400 font-medium">{s.desc}</p>
                </div>
             </div>
             <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Settings size={20} />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
