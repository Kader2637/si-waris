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
    <div className="space-y-16 pb-20">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Panduan Sistem & Hukum Waris</h1>
        <p className="text-slate-500 mt-2 font-medium">Referensi resmi hukum waris Syariat Islam dan tradisi Adat Jawa.</p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-black flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">1</span> Hukum Syariat (Faraid)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {panduanIslam.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 group hover:-translate-y-2 transition-all">
               <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:rotate-12 transition-transform`}>
                  <item.icon size={28} />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
               <p className="text-slate-500 leading-relaxed font-medium text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-black flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">2</span> Hukum Adat Jawa</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {panduanJawa.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 group hover:-translate-y-2 transition-all">
               <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:rotate-12 transition-transform`}>
                  <item.icon size={28} />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
               <p className="text-slate-500 leading-relaxed font-medium text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div className="space-y-6">
               <h2 className="text-3xl font-black leading-tight">Edukasi Pembagian Harta</h2>
               <p className="text-slate-400 font-medium">Pemahaman komprehensif terkait resolusi konflik dan musyawarah mufakat dalam pembagian waris keluarga.</p>
               <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                  Download Modul Edukasi (PDF)
               </button>
            </div>
            <div className="flex justify-center lg:justify-end">
               <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <Star size={80} className="text-white/20" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
