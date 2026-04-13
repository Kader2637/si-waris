import { BookOpen, Scale, ShieldCheck, HelpCircle, Star } from "lucide-react";

export default function PanduanPage() {
  const panduanItems = [
    { 
      title: "Hukum Faraid Dasar", 
      desc: "Hukum pembagian waris adalah ketetapan Allah (Faridhatun minallah) yang sudah ditentukan kadarnya dalam Al-Qur'an.", 
      icon: Scale, 
      color: "text-blue-600", bg: "bg-blue-50" 
    },
    { 
      title: "Rukun & Syarat Waris", 
      desc: "Adanya pewaris, ahli waris, dan harta warisan serta tidak adanya penghalang waris seperti pembunuhan atau beda agama.", 
      icon: ShieldCheck, 
      color: "text-emerald-600", bg: "bg-emerald-50" 
    },
    { 
      title: "Kasus Mahjub (Terhalang)", 
      desc: "Menjelaskan kenapa seseorang tidak mendapat waris jika ada pihak lain yang lebih dekat hubungannya (Hirman).", 
      icon: HelpCircle, 
      color: "text-amber-600", bg: "bg-amber-50" 
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Edukasi & Panduan Syar'i</h1>
        <p className="text-slate-500 mt-2 font-medium">Referensi resmi hukum waris Islam berdasarkan Al-Qur'an dan As-Sunnah.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {panduanItems.map((item, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30 group hover:-translate-y-2 transition-all">
             <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:rotate-12 transition-transform`}>
                <item.icon size={32} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
             <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-600 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div className="space-y-6">
               <h2 className="text-3xl font-black leading-tight">Mempelajari 'Ashabah, 'Aul, dan Radd</h2>
               <p className="text-emerald-100 font-medium opaicity-90">Pemahaman mendalam tentang penyesuaian perhitungan saat total pembilang melebihi atau kurang dari penyebut.</p>
               <button className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl active:scale-95">
                  Download Kitab Faraid (PDF)
               </button>
            </div>
            <div className="flex justify-center lg:justify-end">
               <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Star size={80} className="text-white/40" />
               </div>
            </div>
         </div>
         <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}
