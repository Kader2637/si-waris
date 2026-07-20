export default function SettingsPage() {
  return (
    <div>
      
      {/* Header Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2 border-bottom pb-3">
        <div>
          <h2 className="font-serif fw-bold text-dark m-0">Pengaturan WP-Admin</h2>
          <p className="text-secondary small m-0">Konfigurasi sistem, keamanan database, dan preferensi portal.</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="row g-4">
        
        <div className="col-md-4">
          <div className="card wp-card p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-success text-white rounded p-2"><i className="bi bi-shield-lock fs-4"></i></div>
              <h5 className="font-serif fw-bold m-0 text-dark">Profil & Keamanan</h5>
            </div>
            <p className="small text-secondary mb-3">Kelola kredensial administrator & sesi masuk WP-Admin.</p>
            <button className="btn btn-outline-success btn-sm w-100 fw-bold">Kelola Akun</button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card wp-card p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-primary text-white rounded p-2"><i className="bi bi-database-gear fs-4"></i></div>
              <h5 className="font-serif fw-bold m-0 text-dark">Database Prisma</h5>
            </div>
            <p className="small text-secondary mb-3">Status koneksi PostgreSQL & migrasi skema waris.</p>
            <button className="btn btn-outline-primary btn-sm w-100 fw-bold">Status DB</button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card wp-card p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-warning text-dark rounded p-2"><i className="bi bi-sliders fs-4"></i></div>
              <h5 className="font-serif fw-bold m-0 text-dark">Preferensi Portal</h5>
            </div>
            <p className="small text-secondary mb-3">Pengaturan judul website, versi syariat, & banner topbar.</p>
            <button className="btn btn-outline-warning btn-sm text-dark w-100 fw-bold">Pengaturan General</button>
          </div>
        </div>

      </div>

    </div>
  );
}
