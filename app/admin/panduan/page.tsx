import { BookOpen, Scale, ShieldCheck, HelpCircle, Star, Users } from "lucide-react";

export default function PanduanPage() {
  const panduanIslam = [
    { 
      title: "Hukum Faraid Dasar", 
      desc: "Hukum pembagian waris adalah ketetapan Allah yang sudah ditentukan kadarnya dalam Al-Qur'an (As-Sunnah).", 
      icon: Scale, 
      color: "text-emerald-600", bg: "bg-emerald-50" 
    },
    { 
      title: "Rukun & Syarat", 
      desc: "Adanya pewaris, ahli waris, harta, serta tidak adanya penghalang waris seperti beda agama.", 
      icon: ShieldCheck, 
      color: "text-teal-600", bg: "bg-teal-50" 
    },
    { 
      title: "Kasus Mahjub", 
      desc: "Seseorang terhalang waris (Hirman) jika ada kerabat lain yang jalurnya lebih dekat ke jenazah.", 
      icon: HelpCircle, 
      color: "text-blue-600", bg: "bg-blue-50" 
    },
  ];

  const panduanJawa = [
    { 
      title: "Filosofi Adat Jawa", 
      desc: "Pembagian waris berlandaskan asas kerukunan, gotong royong, dan 'mangan ora mangan kumpul' tanpa kaku pada matematis.", 
      icon: Users, 
      color: "text-amber-600", bg: "bg-amber-50" 
    },
    { 
      title: "Sepikul Segendongan", 
      desc: "Asas proporsional. Laki-laki memikul tanggung jawab lebih besar (2 bagian), perempuan menggendong (1 bagian).", 
      icon: Scale, 
      color: "text-orange-600", bg: "bg-orange-50" 
    },
    { 
      title: "Kum-Kum Kupat", 
      desc: "Asas pemerataan mutlak. Harta dibagi sama rata (1:1) tanpa memandang gender demi menghindari konflik persaudaraan.", 
      icon: BookOpen, 
      color: "text-yellow-600", bg: "bg-yellow-50" 
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Panduan Sistem & Hukum Waris</h1>
        <p className="text-slate-500 mt-1 font-medium text-xs">Referensi resmi hukum waris Syariat Islam dan tradisi Adat Jawa.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-black flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">1</span> Hukum Syariat (Faraid)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {panduanIslam.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md shadow-slate-200/20 group hover:-translate-y-1.5 transition-all">
               <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-inner group-hover:rotate-12 transition-transform`}>
                  <item.icon size={20} />
               </div>
               <h3 className="text-base font-black text-slate-900 mb-2">{item.title}</h3>
               <p className="text-slate-500 leading-relaxed font-medium text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-black flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">2</span> Hukum Adat Jawa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {panduanJawa.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md shadow-slate-200/20 group hover:-translate-y-1.5 transition-all">
               <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-inner group-hover:rotate-12 transition-transform`}>
                  <item.icon size={20} />
               </div>
               <h3 className="text-base font-black text-slate-900 mb-2">{item.title}</h3>
               <p className="text-slate-500 leading-relaxed font-medium text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-6">
            <div className="space-y-4">
               <h2 className="text-xl font-black leading-tight">Edukasi Pembagian Harta</h2>
               <p className="text-slate-400 font-medium text-xs leading-relaxed">Pemahaman komprehensif terkait resolusi konflik dan musyawarah mufakat dalam pembagian waris keluarga.</p>
               <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                  Download Modul Edukasi (PDF)
               </button>
            </div>
            <div className="flex justify-center lg:justify-end">
               <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <Star size={48} className="text-white/20" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
