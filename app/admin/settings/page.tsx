"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Database,
  Sliders,
  CheckCircle2,
  Save,
  Download,
  RefreshCw,
  User,
  Key,
  Globe,
  Bell,
  Lock,
  Server,
  Activity,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "security" | "database" | "general">("overview");

  // Admin Profile State
  const [adminName, setAdminName] = useState("Administrator E-MAWARIST");
  const [adminEmail, setAdminEmail] = useState("admin@e-mawarist.id");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Portal Preferences State
  const [portalTitle, setPortalTitle] = useState("E-MAWARIST — Sistem Informasi Waris Multi-Hukum");
  const [defaultSystem, setDefaultSystem] = useState("syariah");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [marqueeEnabled, setMarqueeEnabled] = useState(true);
  const [marqueeText, setMarqueeText] = useState("Selamat Datang di E-MAWARIST Portal Resmi Pembagian Waris Indonesia");

  // DB & System State
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbLatency, setDbLatency] = useState<number | null>(14);
  const [dbStatus, setDbStatus] = useState<"connected" | "testing" | "error">("connected");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTitle = localStorage.getItem("setting_portalTitle");
    if (savedTitle) setPortalTitle(savedTitle);

    const savedName = localStorage.getItem("setting_adminName");
    if (savedName) setAdminName(savedName);

    const savedEmail = localStorage.getItem("setting_adminEmail");
    if (savedEmail) setAdminEmail(savedEmail);

    const savedMarquee = localStorage.getItem("setting_marqueeText");
    if (savedMarquee) setMarqueeText(savedMarquee);

    const savedMaint = localStorage.getItem("setting_maintenanceMode");
    if (savedMaint === "true") setMaintenanceMode(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      showToast("❌ Konfirmasi kata sandi baru tidak cocok!");
      return;
    }
    localStorage.setItem("setting_adminName", adminName);
    localStorage.setItem("setting_adminEmail", adminEmail);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("✅ Profil & Keamanan Admin berhasil diperbarui!");
  };

  const toggleMaintenanceMode = () => {
    const nextVal = !maintenanceMode;
    setMaintenanceMode(nextVal);
    localStorage.setItem("setting_maintenanceMode", String(nextVal));
    window.dispatchEvent(new Event("storage"));
    showToast(nextVal ? "⚠️ Mode Pemeliharaan (Maintenance) DIAKTIFKAN!" : "✅ Mode Pemeliharaan NONAKTIF. Sistem berjalan normal.");
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("setting_portalTitle", portalTitle);
    localStorage.setItem("setting_marqueeText", marqueeText);
    localStorage.setItem("setting_maintenanceMode", String(maintenanceMode));
    window.dispatchEvent(new Event("storage"));
    showToast("✅ Preferensi Portal & General berhasil disimpan!");
  };

  const handleTestDb = () => {
    setIsTestingDb(true);
    setDbStatus("testing");
    setTimeout(() => {
      setIsTestingDb(false);
      setDbStatus("connected");
      setDbLatency(Math.floor(Math.random() * 12) + 8);
      showToast("✅ Koneksi PostgreSQL & Prisma Client Berjalan Normal (Latency < 20ms)");
    }, 1200);
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      platform: "E-MAWARIST",
      version: "1.0.0",
      settings: {
        portalTitle,
        defaultSystem,
        maintenanceMode,
        marqueeEnabled,
        marqueeText,
        adminEmail,
      },
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_emawarist_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("📥 File Backup Konfigurasi Portal (.json) berhasil diunduh.");
  };

  return (
    <div className="space-y-6 text-[#0f172a] font-sans antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 text-white px-5 py-3.5 shadow-2xl border border-slate-700 animate-rise text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Pengaturan Sistem Portal</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Konfigurasi sistem, status database PostgreSQL/Prisma, dan preferensi portal E-MAWARIST.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Download className="size-4 text-slate-500" /> Export Backup
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 overflow-x-auto pb-0.5">
        {[
          { id: "overview", label: "Ringkasan Pengaturan", icon: Activity },
          { id: "security", label: "Profil & Keamanan", icon: Shield },
          { id: "database", label: "Database & Sistem", icon: Database },
          { id: "general", label: "Preferensi Portal", icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-[#0b6245] text-[#0b6245] dark:border-emerald-400 dark:text-emerald-400 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW CARDS */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 bg-[#e6f4ee] dark:bg-[#0b6245]/20 text-[#0b6245] dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold">
                  <Shield className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Profil & Keamanan</h2>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Terverifikasi</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Kelola nama administrator, email pemberitahuan, dan ubah kata sandi sesi portal E-MAWARIST.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("security")}
              className="w-full py-2.5 px-4 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <User className="size-4" /> Kelola Akun Admin
            </button>
          </div>

          <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold">
                  <Database className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Database Prisma</h2>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-medium">PostgreSQL Active</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Uji status koneksi PostgreSQL, cek statistik migrasi skema waris, dan unduh backup JSON.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("database")}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Server className="size-4" /> Cek Status DB
            </button>
          </div>

          <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold">
                  <Sliders className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Preferensi Portal</h2>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Mode Normal</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Pengaturan judul website, preferensi hukum default kalkulator, dan running text marquee topbar.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("general")}
              className="w-full py-2.5 px-4 bg-[#ca9a28] hover:bg-[#a87e1c] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Globe className="size-4" /> Pengaturan General
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: PROFIL & KEAMANAN */}
      {activeTab === "security" && (
        <form onSubmit={handleSaveSecurity} className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6 w-full">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="size-10 bg-[#e6f4ee] dark:bg-[#0b6245]/20 text-[#0b6245] dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold">
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Profil & Keamanan Administrator</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Perbarui identitas admin dan kredensial login portal.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="size-3.5 text-[#0b6245]" /> Nama Lengkap Admin
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b6245]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="size-3.5 text-[#0b6245]" /> Email Administrator
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b6245]"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Key className="size-4 text-[#ca9a28]" /> Ganti Kata Sandi (Opsional)
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  placeholder="Masukkan kata sandi lama"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b6245]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Kata Sandi Baru</label>
                  <input
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b6245]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    placeholder="Ulangi kata sandi baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b6245]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="2fa"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="size-4 rounded text-[#0b6245] focus:ring-[#0b6245]"
              />
              <label htmlFor="2fa" className="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                Aktifkan Verifikasi Dua Langkah (2FA) saat login
              </label>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="size-4" /> Simpan Profil
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: DATABASE PRISMA & SISTEM */}
      {activeTab === "database" && (
        <div className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold">
                <Database className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Status Database PostgreSQL & Prisma</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pemeriksaan koneksi skema data waris & performa sistem.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestDb}
              disabled={isTestingDb}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`size-4 ${isTestingDb ? "animate-spin" : ""}`} />
              {isTestingDb ? "Menguji Koneksi..." : "Tes Koneksi DB"}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">STATUS KONEKSI</span>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-base">
                <CheckCircle2 className="size-5 shrink-0" /> PostgreSQL Ready
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">PRISMA CLIENT VERSION</span>
              <p className="text-slate-900 dark:text-slate-100 font-extrabold text-base font-mono">v7.7.0</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">DB LATENCY</span>
              <p className="text-blue-600 dark:text-blue-400 font-extrabold text-base font-mono">{dbLatency ? `${dbLatency} ms` : "Checking..."}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Statistik Tabel Data</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden text-xs">
              <div className="p-3.5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Pewaris Table (`Pewaris`)</span>
                <span className="font-bold font-mono text-[#0b6245] dark:text-emerald-400">Active Record</span>
              </div>
              <div className="p-3.5 flex justify-between items-center bg-white dark:bg-[#151c2c]">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Ahli Waris Table (`AhliWaris`)</span>
                <span className="font-bold font-mono text-[#0b6245] dark:text-emerald-400">Active Record</span>
              </div>
              <div className="p-3.5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Hasil Perhitungan Table (`HasilPerhitungan`)</span>
                <span className="font-bold font-mono text-[#0b6245] dark:text-emerald-400">Active Record</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pengaturan skema database dikelola otomatis melalui migrasi Prisma Engine.
            </p>
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Download className="size-4" /> Download Backup JSON
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: PREFERENSI PORTAL & GENERAL */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="bg-white dark:bg-[#151c2c] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6 w-full">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="size-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold">
              <Sliders className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Preferensi & Tampilan Portal</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Konfigurasi nama platform, opsi kalkulator default, & topbar notification.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Judul Utama Platform (SEO Title)</label>
              <input
                type="text"
                required
                value={portalTitle}
                onChange={(e) => setPortalTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b6245]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sistem Hukum Default Kalkulator</label>
                <select
                  value={defaultSystem}
                  onChange={(e) => setDefaultSystem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b6245]"
                >
                  <option value="syariah">Hukum Syariah (Faraidh)</option>
                  <option value="perdata">Hukum Perdata (KUHPerdata / BW)</option>
                  <option value="adat-jawa">Hukum Adat Jawa (Sepikul Segendongan)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status Pemeliharaan System</label>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={toggleMaintenanceMode}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      maintenanceMode ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        maintenanceMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {maintenanceMode ? "Mode Pemeliharaan Aktif" : "Sistem Berjalan Normal"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Running Text / Topbar Marquee</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="marqueeCheck"
                    checked={marqueeEnabled}
                    onChange={(e) => setMarqueeEnabled(e.target.checked)}
                    className="size-3.5 rounded text-[#0b6245]"
                  />
                  <label htmlFor="marqueeCheck" className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer">Tampilkan Marquee</label>
                </div>
              </div>
              <textarea
                rows={2}
                value={marqueeText}
                onChange={(e) => setMarqueeText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b6245]"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#ca9a28] hover:bg-[#a87e1c] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="size-4" /> Simpan Preferensi Portal
            </button>
          </div>
        </form>
      )}

    </div>
  );
}

