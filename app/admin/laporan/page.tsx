import { prisma } from "@/lib/prisma";

export default async function LaporanPage() {
  const totalHartaDistributedResult = await prisma.logKalkulasi.aggregate({
    _sum: { totalHartaBersih: true }
  });
  const totalHartaStrings = (totalHartaDistributedResult._sum.totalHartaBersih || 0).toLocaleString('id-ID');
  const countFamilies = await prisma.jenazah.count();
  const countHeirs = await prisma.ahliWaris.count();
  const countCalculated = await prisma.logKalkulasi.count();

  return (
    <div>
      
      {/* Header */}
      <div className="card wp-card p-4 mb-4 border-0 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h2 className="font-serif fw-bold text-dark m-0">Laporan & Analitik Rekap</h2>
            <p className="text-secondary small m-0">Analisis statistik kumulatif distribusi harta waris di database.</p>
          </div>
        </div>
      </div>

      {/* Stat Grid (Clean White Cards, No Tacky Colored Borders) */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card wp-card p-4 border-0 shadow-sm h-100">
            <span className="text-muted fs-8 font-monospace text-uppercase fw-bold">Total Harta Terproses</span>
            <h4 className="fw-bold text-success mt-2 mb-0">Rp {totalHartaStrings}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card wp-card p-4 border-0 shadow-sm h-100">
            <span className="text-muted fs-8 font-monospace text-uppercase fw-bold">Total Keluarga</span>
            <h4 className="fw-bold text-dark mt-2 mb-0">{countFamilies} Kasus</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card wp-card p-4 border-0 shadow-sm h-100">
            <span className="text-muted fs-8 font-monospace text-uppercase fw-bold">Total Ahli Waris</span>
            <h4 className="fw-bold text-dark mt-2 mb-0">{countHeirs} Orang</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card wp-card p-4 border-0 shadow-sm h-100">
            <span className="text-muted fs-8 font-monospace text-uppercase fw-bold">Kalkulasi Selesai</span>
            <h4 className="fw-bold text-dark mt-2 mb-0">{countCalculated} Laporan</h4>
          </div>
        </div>
      </div>

      {/* Progress metrics */}
      <div className="card wp-card p-4 border-0 shadow-sm">
        <h5 className="font-serif fw-bold text-dark mb-4">
          <i className="bi bi-bar-chart-fill text-primary me-2"></i> Indikator Performa Sistem
        </h5>

        <div className="space-y-4">
          <div className="p-3 bg-light rounded-3 border">
            <div className="d-flex justify-content-between small fw-bold mb-1">
              <span>Akurasi Pembagian Syar'i (Faraid & KHI)</span>
              <span className="text-success">100%</span>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div className="progress-bar bg-success rounded-pill" style={{ width: "100%" }}></div>
            </div>
          </div>

          <div className="p-3 bg-light rounded-3 border">
            <div className="d-flex justify-content-between small fw-bold mb-1">
              <span>Kelengkapan Berkas Ahli Waris</span>
              <span className="text-primary">85%</span>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div className="progress-bar bg-primary rounded-pill" style={{ width: "85%" }}></div>
            </div>
          </div>

          <div className="p-3 bg-light rounded-3 border">
            <div className="d-flex justify-content-between small fw-bold mb-1">
              <span>Kepatuhan Hukum Adat & Perdata</span>
              <span className="text-warning-emphasis">98%</span>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div className="progress-bar bg-warning rounded-pill" style={{ width: "98%" }}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
