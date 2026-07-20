import Link from "next/link";

export default function PanduanPage() {
  return (
    <div>
      
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2 border-bottom pb-3">
        <div>
          <h2 className="font-serif fw-bold text-dark m-0">Panduan Sistem & Modul Edukasi Waris</h2>
          <p className="text-secondary small m-0">Referensi kaidah Faraid Islam, Hukum Adat Jawa, dan KUHPerdata.</p>
        </div>
      </div>

      {/* Accordion / Cards Grid */}
      <div className="row g-4 mb-4">
        
        {/* Islam */}
        <div className="col-lg-4 col-md-6">
          <div className="card wp-card h-100 p-4 border-top border-4 border-success">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-success text-white rounded p-2"><i className="bi bi-moon-stars fs-4"></i></div>
              <h5 className="font-serif fw-bold m-0 text-dark">Faraid Islam</h5>
            </div>
            <p className="small text-secondary leading-relaxed mb-3">
              Berdasarkan Al-Qur'an (Surah An-Nisa), Hadits Shahih, dan KHI Buku II. Mengatur bagian pasti (Dzawil Furudh) dan porsi sisa (Ashabah).
            </p>
            <Link href="/syariah" className="btn btn-outline-success btn-sm w-100 fw-bold mt-auto">
              Buka Modul Syariat <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>

        {/* Adat Jawa */}
        <div className="col-lg-4 col-md-6">
          <div className="card wp-card h-100 p-4 border-top border-4 border-warning">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-warning text-dark rounded p-2"><i className="bi bi-bank fs-4"></i></div>
              <h5 className="font-serif fw-bold m-0 text-dark">Adat Jawa</h5>
            </div>
            <p className="small text-secondary leading-relaxed mb-3">
              Berdasarkan prinsip Sepikul Segendongan (2:1) dan Dum-Duman Kerukunan (1:1) dengan pemotongan 50% Gono-Gini.
            </p>
            <Link href="/adat-jawa" className="btn btn-outline-warning btn-sm w-100 fw-bold text-dark mt-auto">
              Buka Modul Adat <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>

        {/* Perdata */}
        <div className="col-lg-4 col-md-6">
          <div className="card wp-card h-100 p-4 border-top border-4 border-primary">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-primary text-white rounded p-2"><i className="bi bi-balance-scale fs-4"></i></div>
              <h5 className="font-serif fw-bold m-0 text-dark">Perdata (BW)</h5>
            </div>
            <p className="small text-secondary leading-relaxed mb-3">
              Berdasarkan KUHPerdata Pasal 830-1130 dengan 4 Golongan Ahli Waris tanpa pembedaan gender.
            </p>
            <Link href="/perdata" className="btn btn-outline-primary btn-sm w-100 fw-bold mt-auto">
              Buka Modul Perdata <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
