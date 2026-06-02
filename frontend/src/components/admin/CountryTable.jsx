import { useState, useEffect } from "react";
import {
  getCountries,
  addCountry,
  updateCountry,
  deleteCountry,
} from "../../api/masterData";

export default function CountryTable() {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Form States
  const [namaNegara, setNamaNegara] = useState("");
  const [kodeNegara, setKodeNegara] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getCountries();
      if (res.success) setCountries(res.data);
    } catch {
      setErrorMsg("Gagal memuat data negara.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // Handlers
  const handleOpenForm = (country = null) => {
    setErrorMsg("");
    if (country) {
      setSelectedCountry(country);
      setNamaNegara(country.namaNegara);
      setKodeNegara(country.kodeNegara || "");
    } else {
      setSelectedCountry(null);
      setNamaNegara("");
      setKodeNegara("");
    }
    setShowFormModal(true);
  };

  const handleSave = async () => {
    if (!namaNegara.trim()) {
      setErrorMsg("Nama Negara wajib diisi");
      return;
    }
    try {
      setIsSubmitting(true);
      setErrorMsg("");
      const payload = { namaNegara, kodeNegara };

      if (selectedCountry) {
        await updateCountry(selectedCountry.id, payload);
      } else {
        await addCountry(payload);
      }
      setShowFormModal(false);
      fetchData();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Terjadi kesalahan saat menyimpan data",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (country) => {
    setSelectedCountry(country);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteCountry(selectedCountry.id);
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal menghapus data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-admin-headline-md text-[18px]">Data Negara</h2>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 text-[12px] font-admin-label tracking-widest cursor-pointer transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--color-admin-primary)",
            color: "var(--color-admin-on-primary)",
          }}
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          ADD COUNTRY
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && !showFormModal && !showDeleteModal && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm border border-red-300">
          {errorMsg}
        </div>
      )}

      {/* Table */}
      <div
        className="border"
        style={{
          borderColor: "var(--color-admin-outline-variant)",
          backgroundColor: "var(--color-admin-surface-container-lowest)",
        }}
      >
        <div
          className="grid items-center px-4 py-3 border-b"
          style={{
            gridTemplateColumns: "1fr 1fr 150px",
            borderColor: "var(--color-admin-outline-variant)",
            backgroundColor: "var(--color-admin-surface-container-low)",
          }}
        >
          <span
            className="font-admin-label text-[10px]"
            style={{ color: "var(--color-admin-on-surface-variant)" }}
          >
            NAMA NEGARA
          </span>
          <span
            className="font-admin-label text-[10px]"
            style={{ color: "var(--color-admin-on-surface-variant)" }}
          >
            KODE NEGARA
          </span>
          <span
            className="font-admin-label text-[10px] text-right"
            style={{ color: "var(--color-admin-on-surface-variant)" }}
          >
            AKSI
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading data...
          </div>
        ) : countries.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Belum ada data negara.
          </div>
        ) : (
          countries.map((item, index) => (
            <div
              key={item.id}
              className="grid items-center px-4 py-3 transition-colors"
              style={{
                gridTemplateColumns: "1fr 1fr 150px",
                borderBottom:
                  index < countries.length - 1
                    ? "1px solid var(--color-admin-outline-variant)"
                    : "none",
              }}
            >
              <span
                className="font-admin-body-md"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                {item.namaNegara}
              </span>
              <span
                className="font-admin-body-md"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                {item.kodeNegara || "-"}
              </span>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => handleOpenForm(item)}
                  className="material-symbols-outlined text-[18px] cursor-pointer hover:opacity-70"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  edit
                </button>
                <button
                  onClick={() => confirmDelete(item)}
                  className="material-symbols-outlined text-[18px] cursor-pointer hover:opacity-70"
                  style={{ color: "var(--color-admin-error)" }}
                >
                  delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- MODAL FORM (ADD/EDIT) --- */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFormModal(false)}
          />
          <div
            className="relative w-full max-w-md border z-10 p-6"
            style={{
              backgroundColor: "var(--color-admin-surface-container-lowest)",
              borderColor: "var(--color-admin-outline-variant)",
            }}
          >
            <h2 className="font-admin-headline-md mb-4">
              {selectedCountry ? "Edit Country" : "Add New Country"}
            </h2>
            {errorMsg && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 text-xs border border-red-300">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-admin-label text-[10px]"
                  style={{ color: "var(--color-admin-primary)" }}
                >
                  NAMA NEGARA *
                </label>
                <input
                  type="text"
                  value={namaNegara}
                  onChange={(e) => setNamaNegara(e.target.value)}
                  className="w-full bg-transparent font-admin-body-md outline-none py-2 border-b"
                  style={{ borderColor: "var(--color-admin-outline-variant)" }}
                  placeholder="e.g. Indonesia"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-admin-label text-[10px]"
                  style={{ color: "var(--color-admin-primary)" }}
                >
                  KODE NEGARA
                </label>
                <input
                  type="text"
                  value={kodeNegara}
                  onChange={(e) => setKodeNegara(e.target.value)}
                  className="w-full bg-transparent font-admin-body-md outline-none py-2 border-b"
                  style={{ borderColor: "var(--color-admin-outline-variant)" }}
                  placeholder="e.g. ID"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowFormModal(false)}
                className="px-4 py-2 border font-admin-label text-[10px] tracking-widest cursor-pointer"
                style={{ borderColor: "var(--color-admin-on-surface)" }}
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-4 py-2 font-admin-label text-[10px] tracking-widest cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: "var(--color-admin-on-surface)",
                  color: "var(--color-admin-surface)",
                }}
              >
                {isSubmitting ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DELETE CONFIRMATION --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          />
          <div
            className="relative w-90 border p-8 flex flex-col items-center text-center z-10"
            style={{
              backgroundColor: "var(--color-admin-surface-container-lowest)",
              borderColor: "var(--color-admin-outline-variant)",
            }}
          >
            <span
              className="material-symbols-outlined text-[32px] mb-4"
              style={{ color: "var(--color-admin-error)" }}
            >
              warning
            </span>
            <h3 className="font-admin-headline-md mb-2">Hapus Negara?</h3>
            <p className="font-admin-body-md text-[13px] mb-5 text-gray-500">
              Data <strong>{selectedCountry?.namaNegara}</strong> akan dihapus
              permanen.
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-10 border font-admin-label text-[10px] tracking-widest cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 h-10 font-admin-label text-[10px] tracking-widest cursor-pointer"
                style={{
                  backgroundColor: "var(--color-admin-error)",
                  color: "#ffffff",
                }}
              >
                {isSubmitting ? "MENGHAPUS..." : "HAPUS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
