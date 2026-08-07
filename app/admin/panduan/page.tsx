import Link from "next/link";
import { Moon, Landmark, Scale, ArrowRight } from "lucide-react";

export default function PanduanPage() {
  return (
    <div className="space-y-6 text-[#0f172a] font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <h1 className="text-2xl font-bold text-slate-900">Panduan Sistem & Modul Edukasi Waris</h1>
        <p className="text-slate-500 text-xs mt-1">Referensi kaidah Faraid Islam, Hukum Adat Jawa, dan KUHPerdata.</p>
      </div>

      {/* Cards Grid */}
      <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Islam */}
        <div className="bg-white rounded-2xl p-6 border-t-4 border-t-[#0b6245] border-x border-b border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 bg-[#e6f4ee] text-[#0b6245] rounded-xl flex items-center justify-center font-bold">
                <Moon className="size-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Faraid Islam</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Berdasarkan Al-Qur'an (Surah An-Nisa), Hadits Shahih, dan KHI Buku II. Mengatur bagian pasti (Dzawil Furudh) dan porsi sisa (Ashabah).
            </p>
          </div>
          <Link 
            href="/syariah" 
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl transition-all no-underline shadow-xs mt-auto"
          >
            Buka Modul Syariat <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Adat Jawa */}
        <div className="bg-white rounded-2xl p-6 border-t-4 border-t-[#ca9a28] border-x border-b border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                <Landmark className="size-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Adat Jawa</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Berdasarkan prinsip Sepikul Segendongan (2:1) dan Dum-Duman Kerukunan (1:1) dengan pemotongan 50% Gono-Gini.
            </p>
          </div>
          <Link 
            href="/adat-jawa" 
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-[#ca9a28] hover:bg-[#a87e1c] text-white text-xs font-semibold rounded-xl transition-all no-underline shadow-xs mt-auto"
          >
            Buka Modul Adat <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Perdata */}
        <div className="bg-white rounded-2xl p-6 border-t-4 border-t-blue-600 border-x border-b border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                <Scale className="size-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Perdata (BW)</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Berdasarkan KUHPerdata Pasal 830-1130 dengan 4 Golongan Ahli Waris tanpa pembedaan gender.
            </p>
          </div>
          <Link 
            href="/perdata" 
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all no-underline shadow-xs mt-auto"
          >
            Buka Modul Perdata <ArrowRight className="size-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}
