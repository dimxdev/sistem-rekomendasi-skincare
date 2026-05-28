import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const isAdminSession = Boolean(localStorage.getItem("admin"));
  const homePath = isAdminSession ? "/admin/dashboard" : "/";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-[radial-gradient(circle_at_top,rgba(212,210,199,0.18),transparent_35%),linear-gradient(180deg,#f8f5ef_0%,#f1ece3_100%)]">
      <div className="max-w-180 w-full border border-outline-variant bg-surface-bright shadow-[0_24px_80px_rgba(54,46,31,0.08)]">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <section className="p-10 sm:p-14 flex flex-col justify-center gap-6">
            <p className="font-label-caps tracking-[0.35em] text-secondary">
              PAGE NOT FOUND
            </p>
            <div>
              <h1 className="font-display text-[72px] sm:text-[92px] leading-none text-on-surface">
                404
              </h1>
              <p className="mt-4 max-w-104 font-body text-[15px] leading-7 text-on-surface-variant">
                Halaman yang kamu cari tidak tersedia, sudah dipindah, atau
                alamatnya salah.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(homePath)}
                className="px-5 py-3 bg-primary text-on-primary font-body text-label-caps tracking-[0.22em] uppercase hover:opacity-90 transition-opacity cursor-pointer"
              >
                {isAdminSession ? "Ke Dashboard" : "Ke Beranda"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-3 border border-outline-variant text-on-surface font-body text-label-caps tracking-[0.22em] uppercase hover:border-outline hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </section>

          <aside className="border-t lg:border-t-0 lg:border-l border-outline-variant bg-surface-container-low p-10 sm:p-14 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-2 border border-outline-variant bg-surface-bright">
                <span className="material-symbols-outlined text-body-lg text-secondary">
                  warning
                </span>
                <span className="font-label-caps text-[11px] tracking-[0.22em] text-on-surface-variant">
                  ROUTE ERROR
                </span>
              </div>
              <p className="font-headline-md text-on-surface">
                Cek ulang URL atau gunakan navigasi di bawah.
              </p>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full text-left px-4 py-3 border border-outline-variant bg-surface-bright hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className="block font-body text-on-surface">
                  Homepage
                </span>
                <span className="block mt-1 font-data text-[11px] text-on-surface-variant">
                  Lihat koleksi produk skincare
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/favorites")}
                className="w-full text-left px-4 py-3 border border-outline-variant bg-surface-bright hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className="block font-body text-on-surface">
                  Favorites
                </span>
                <span className="block mt-1 font-data text-[11px] text-on-surface-variant">
                  Produk yang kamu simpan
                </span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
