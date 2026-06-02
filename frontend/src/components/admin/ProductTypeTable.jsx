import { useState, useEffect } from "react";
import {
  getProductTypes,
  addProductType,
  updateProductType,
  deleteProductType,
} from "../../api/masterData";

export default function ProductTypeTable() {
  const [productTypes, setProductTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  // Form States
  const [nama, setNama] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getProductTypes();
      if (res.success) setProductTypes(res.data);
    } catch {
      setErrorMsg("Gagal memuat data tipe produk.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // Handlers
  const handleOpenForm = (productType = null) => {
    setErrorMsg("");
    if (productType) {
      setSelectedType(productType);
      setNama(productType.nama);
    } else {
      setSelectedType(null);
      setNama("");
    }
    setShowFormModal(true);
  };

  const handleSave = async () => {
    if (!nama.trim()) {
      setErrorMsg("Nama Tipe Produk wajib diisi");
      return;
    }
    try {
      setIsSubmitting(true);
      setErrorMsg("");
      const payload = { nama };

      if (selectedType) {
        await updateProductType(selectedType.id, payload);
      } else {
        await addProductType(payload);
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

  const confirmDelete = (productType) => {
    setSelectedType(productType);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteProductType(selectedType.id);
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
        <h2 className="font-admin-headline-md text-[18px]">Data Tipe Produk</h2>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 text-[12px] font-admin-label tracking-widest cursor-pointer transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--color-admin-primary)",
            color: "var(--color-admin-on-primary)",
          }}
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          ADD TYPE
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
            gridTemplateColumns: "1fr 150px",
            borderColor: "var(--color-admin-outline-variant)",
            backgroundColor: "var(--color-admin-surface-container-low)",
          }}
        >
          <span
            className="font-admin-label text-[10px]"
            style={{ color: "var(--color-admin-on-surface-variant)" }}
          >
            NAMA TIPE PRODUK
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
        ) : productTypes.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Belum ada data tipe produk.
          </div>
        ) : (
          productTypes.map((item, index) => (
            <div
              key={item.id}
              className="grid items-center px-4 py-3 transition-colors"
              style={{
                gridTemplateColumns: "1fr 150px",
                borderBottom:
                  index < productTypes.length - 1
                    ? "1px solid var(--color-admin-outline-variant)"
                    : "none",
              }}
            >
              <span
                className="font-admin-body-md"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                {item.nama}
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
              {selectedType ? "Edit Product Type" : "Add New Product Type"}
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
                  NAMA TIPE PRODUK *
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full bg-transparent font-admin-body-md outline-none py-2 border-b"
                  style={{ borderColor: "var(--color-admin-outline-variant)" }}
                  placeholder="e.g. Serum, Toner"
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
            <h3 className="font-admin-headline-md mb-2">Hapus Tipe Produk?</h3>
            <p className="font-admin-body-md text-[13px] mb-5 text-gray-500">
              Data <strong>{selectedType?.nama}</strong> akan dihapus permanen.
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
