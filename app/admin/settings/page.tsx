import { Shield, Database, Sliders } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 text-[#0f172a] font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Sistem Portal</h1>
        <p className="text-slate-500 text-xs mt-1">Konfigurasi sistem, keamanan database, dan preferensi portal.</p>
      </div>

      {/* Settings Sections */}
      <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 bg-[#e6f4ee] text-[#0b6245] rounded-xl flex items-center justify-center font-bold">
                <Shield className="size-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Profil & Keamanan</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kelola kredensial administrator & sesi masuk portal E-MAWARIST.
            </p>
          </div>
          <button className="w-full py-2.5 px-4 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer">
            Kelola Akun
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                <Database className="size-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Database Prisma</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Status koneksi PostgreSQL & migrasi skema waris.
            </p>
          </div>
          <button className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer">
            Status DB
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                <Sliders className="size-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Preferensi Portal</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pengaturan judul website, versi syariat, & banner topbar.
            </p>
          </div>
          <button className="w-full py-2.5 px-4 bg-[#ca9a28] hover:bg-[#a87e1c] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer">
            Pengaturan General
          </button>
        </div>

      </div>

    </div>
  );
}
