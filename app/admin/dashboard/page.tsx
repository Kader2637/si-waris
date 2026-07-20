import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const totalJenazah = await prisma.jenazah.count();
  const totalWaris = await prisma.ahliWaris.count();
  const totalCalculated = await prisma.logKalkulasi.count();

  const totalIslam = await prisma.jenazah.count({ where: { hukum: "Islam" } });
  const totalJawa = await prisma.jenazah.count({ where: { hukum: "Jawa" } });
  const totalPerdata = await prisma.jenazah.count({ where: { hukum: "Perdata" } });

  const calculatedIslam = await prisma.logKalkulasi.count({ where: { jenazah: { hukum: "Islam" } } });
  const calculatedJawa = await prisma.logKalkulasi.count({ where: { jenazah: { hukum: "Jawa" } } });

  const lastActive = await prisma.jenazah.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { logKalkulasi: true }
  });

  return (
    <div>
      
      {/* SECTION 1: DRIBBBLE SAAS HERO CARDS GRID */}
      <div className="row g-4 mb-4">
        
        {/* Left Big Indigo Hero Card */}
        <div className="col-lg-7">
          <div className="saas-hero-card h-100 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-center">
              <div className="bg-white bg-opacity-25 rounded-3 p-2.5 d-inline-flex">
                <i className="bi bi-file-earmark-text fs-4 text-white"></i>
              </div>
              <Link href="/admin/keluarga" className="text-white text-decoration-none small fw-bold opacity-90 hover:opacity-100">
                Lihat Detail <i className="bi bi-arrow-up-right ms-1"></i>
              </Link>
            </div>

            <div className="my-4">
              <h1 className="display-4 fw-bold text-white mb-1">{totalJenazah}</h1>
              <div className="text-white opacity-80 small font-monospace">Total Kasus Waris Keluarga Terdaftar</div>
            </div>

            <div className="d-flex gap-3 pt-3 border-top border-white border-opacity-25">
              <span className="badge bg-white bg-opacity-25 text-white font-monospace fs-8">Islam: {totalIslam}</span>
              <span className="badge bg-white bg-opacity-25 text-white font-monospace fs-8">Adat Jawa: {totalJawa}</span>
              <span className="badge bg-white bg-opacity-25 text-white font-monospace fs-8">Perdata: {totalPerdata}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Stacked Stat Cards */}
        <div className="col-lg-5 d-flex flex-column gap-3">
          
          <div className="saas-stat-card-sm flex-fill d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
                <i className="bi bi-people-fill fs-4"></i>
              </div>
              <div>
                <h3 className="fw-bold text-dark m-0">{totalWaris}</h3>
                <div className="text-secondary small">Ahli Waris Terakumulasi</div>
              </div>
            </div>
            <Link href="/admin/keluarga" className="btn btn-sm btn-light border rounded-circle p-2">
              <i className="bi bi-arrow-up-right text-secondary"></i>
            </Link>
          </div>

          <div className="saas-stat-card-sm flex-fill d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-info bg-opacity-10 text-info rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
                <i className="bi bi-calculator-fill fs-4"></i>
              </div>
              <div>
                <h3 className="fw-bold text-dark m-0">{totalCalculated}</h3>
                <div className="text-secondary small">Laporan Perhitungan Selesai</div>
              </div>
            </div>
            <Link href="/admin/laporan" className="btn btn-sm btn-light border rounded-circle p-2">
              <i className="bi bi-arrow-up-right text-secondary"></i>
            </Link>
          </div>

        </div>

      </div>

      {/* SECTION 2: BREAKDOWN & MINI CALENDAR SIDE COLUMN */}
      <div className="row g-4 mb-4">
        
        {/* Left Breakdown System Hukum Bar Charts */}
        <div className="col-lg-7">
          <div className="card wp-card p-4 h-100 border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="font-serif fw-bold text-dark m-0">Distribusi Per Sistem Hukum</h5>
                <span className="text-secondary small">Perbandingan porsi kasus waris di Indonesia</span>
              </div>
              <span className="badge bg-light text-dark border font-monospace fs-8">2026 Data</span>
            </div>

            <div className="space-y-4">
              
              <div className="p-3 bg-light rounded-3 border">
                <div className="d-flex justify-content-between align-items-center small mb-2">
                  <span className="fw-bold text-dark"><i className="bi bi-moon-stars text-success me-2"></i> Hukum Islam (Faraid)</span>
                  <strong className="text-success">{totalIslam} Kasus ({calculatedIslam} Selesai)</strong>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div className="progress-bar bg-success rounded-pill" style={{ width: `${totalJenazah > 0 ? (totalIslam / totalJenazah) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 border">
                <div className="d-flex justify-content-between align-items-center small mb-2">
                  <span className="fw-bold text-dark"><i className="bi bi-bank text-warning me-2"></i> Hukum Adat Jawa</span>
                  <strong className="text-warning-emphasis">{totalJawa} Kasus ({calculatedJawa} Selesai)</strong>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div className="progress-bar bg-warning rounded-pill" style={{ width: `${totalJenazah > 0 ? (totalJawa / totalJenazah) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 border">
                <div className="d-flex justify-content-between align-items-center small mb-2">
                  <span className="fw-bold text-dark"><i className="bi bi-balance-scale text-primary me-2"></i> Hukum Perdata (BW)</span>
                  <strong className="text-primary">{totalPerdata} Kasus</strong>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div className="progress-bar bg-primary rounded-pill" style={{ width: `${totalJenazah > 0 ? (totalPerdata / totalJenazah) * 100 : 0}%` }}></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Mini Calendar Widget */}
        <div className="col-lg-5">
          <div className="saas-calendar-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="font-serif fw-bold text-dark m-0">Juli, 2026</h6>
              <div className="d-flex gap-1">
                <button className="btn btn-sm btn-light border p-1 py-0"><i className="bi bi-chevron-left"></i></button>
                <button className="btn btn-sm btn-light border p-1 py-0"><i className="bi bi-chevron-right"></i></button>
              </div>
            </div>

            {/* Days Header */}
            <div className="saas-calendar-grid fw-bold text-muted mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            {/* Calendar Numbers (Day 20 highlighted as today's date) */}
            <div className="saas-calendar-grid mb-3">
              <span className="saas-calendar-day">1</span>
              <span className="saas-calendar-day">2</span>
              <span className="saas-calendar-day">3</span>
              <span className="saas-calendar-day">4</span>
              <span className="saas-calendar-day">5</span>
              <span className="saas-calendar-day">6</span>
              <span className="saas-calendar-day">7</span>
              <span className="saas-calendar-day">8</span>
              <span className="saas-calendar-day">9</span>
              <span className="saas-calendar-day">10</span>
              <span className="saas-calendar-day">11</span>
              <span className="saas-calendar-day">12</span>
              <span className="saas-calendar-day">13</span>
              <span className="saas-calendar-day">14</span>
              <span className="saas-calendar-day">15</span>
              <span className="saas-calendar-day">16</span>
              <span className="saas-calendar-day">17</span>
              <span className="saas-calendar-day">18</span>
              <span className="saas-calendar-day">19</span>
              <span className="saas-calendar-day active">20</span>
              <span className="saas-calendar-day">21</span>
              <span className="saas-calendar-day">22</span>
              <span className="saas-calendar-day">23</span>
              <span className="saas-calendar-day">24</span>
              <span className="saas-calendar-day">25</span>
              <span className="saas-calendar-day">26</span>
              <span className="saas-calendar-day">27</span>
              <span className="saas-calendar-day">28</span>
              <span className="saas-calendar-day">29</span>
              <span className="saas-calendar-day">30</span>
              <span className="saas-calendar-day">31</span>
            </div>

            <div className="p-2.5 bg-light rounded-3 border d-flex align-items-center justify-content-between">
              <span className="small text-muted"><i className="bi bi-clock me-1 text-primary"></i> Hari Ini: 20 Juli 2026</span>
              <span className="badge bg-success font-monospace">Aktif</span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3: RECENT ACTIVITIES TABLE */}
      <div className="card wp-card p-4 border-0 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="font-serif fw-bold text-dark m-0">Aktivitas Kasus Terbaru</h5>
          <Link href="/admin/keluarga" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
            Lihat Semua <i className="bi bi-chevron-right ms-1"></i>
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle small mb-0">
            <thead className="table-light">
              <tr>
                <th>Nama Pewaris</th>
                <th>Sistem Hukum</th>
                <th>Status Perhitungan</th>
                <th>Waktu Diperbarui</th>
                <th className="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lastActive.length > 0 ? (
                lastActive.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong className="text-dark d-block">{item.nama}</strong>
                      <span className="text-muted fs-8">ID: {item.id}</span>
                    </td>
                    <td>
                      <span className={`badge ${item.hukum === "Jawa" ? "bg-warning text-dark" : item.hukum === "Perdata" ? "bg-primary" : "bg-success"}`}>
                        {item.hukum}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${item.logKalkulasi ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}>
                        {item.logKalkulasi ? "Selesai" : "Draft Input"}
                      </span>
                    </td>
                    <td className="text-muted">{new Date(item.updatedAt).toLocaleTimeString('id-ID')}</td>
                    <td className="text-end">
                      <Link href={`/admin/keluarga/${item.id}`} className="btn btn-sm btn-light border rounded-circle p-1.5 px-2">
                        <i className="bi bi-eye text-primary"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">Belum ada aktivitas kasus terdaftar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
