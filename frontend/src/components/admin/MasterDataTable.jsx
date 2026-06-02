import { useState, useEffect } from "react";

export default function MasterDataTable({
  title,
  fetchApi,
  addApi,
  updateApi,
  deleteApi,
  columns,
  dataKey = "nama",
}) {
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({ [dataKey]: "", kodeNegara: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetchApi();
      if (res.success || Array.isArray(res)) setDataList(res.data || res);
    } catch (err) {
      setErrorMsg(`Gagal memuat data ${title}.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchApi]);

  const handleOpenForm = (item = null) => {
    setErrorMsg("");
    if (item) {
      setSelectedItem(item);
      setFormData({
        [dataKey]: item[dataKey] || item.namaNegara || "",
        kodeNegara: item.kodeNegara || "",
      });
    } else {
      setSelectedItem(null);
      setFormData({ [dataKey]: "", kodeNegara: "" });
    }
    setShowFormModal(true);
  };

  const handleSave = async () => {
    if (!formData[dataKey]?.trim()) {
      setErrorMsg("Kolom utama wajib diisi!");
      return;
    }
    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const payload = { ...formData };

      if (dataKey === "namaNegara") {
        payload.namaNegara = formData[dataKey];
      } else {
        payload.nama = formData[dataKey];
      }

      if (selectedItem) {
        await updateApi(selectedItem.id, payload);
      } else {
        await addApi(payload);
      }
      setShowFormModal(false);
      fetchData();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Terjadi kesalahan saat menyimpan",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteApi(selectedItem.id);
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Gagal menghapus data",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-admin-headline-md text-[18px]">Data {title}</h2>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 text-[12px] font-admin-label tracking-widest cursor-pointer hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "var(--color-admin-primary)",
            color: "var(--color-admin-on-primary)",
          }}
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          ADD NEW
        </button>
      </div>

      {errorMsg && !showFormModal && !showDeleteModal && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm border border-red-200">
          {errorMsg}
        </div>
      )}

      <div
        className="border"
        style={{
          borderColor: "var(--color-admin-outline-variant)",
          backgroundColor: "var(--color-admin-surface-container-lowest)",
        }}
      >
        <div
          className={`grid items-center px-4 py-3 border-b ${columns.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}
          style={{
            borderColor: "var(--color-admin-outline-variant)",
            backgroundColor: "var(--color-admin-surface-container-low)",
          }}
        >
          {columns.map((col, i) => (
            <span
              key={i}
              className={`font-admin-label text-[10px] ${i === columns.length - 1 ? "text-right" : ""}`}
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              {col.label}
            </span>
          ))}
        </div>

        {isLoading ? (
          <div
            className="p-8 text-center text-sm"
            style={{ color: "var(--color-admin-on-surface-variant)" }}
          >
            Loading data...
          </div>
        ) : dataList.length === 0 ? (
          <div
            className="p-8 text-center text-sm"
            style={{ color: "var(--color-admin-on-surface-variant)" }}
          >
            Belum ada data.
          </div>
        ) : (
          dataList.map((item, index) => (
            <div
              key={item.id}
              className={`grid items-center px-4 py-3 transition-colors ${columns.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}
              style={{
                borderBottom:
                  index < dataList.length - 1
                    ? "1px solid var(--color-admin-outline-variant)"
                    : "none",
              }}
            >
              <span
                className="font-admin-body-md"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                {item[dataKey] || item.namaNegara}
              </span>

              {columns.length > 2 && (
                <span
                  className="font-admin-body-md"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  {item.kodeNegara || "-"}
                </span>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => handleOpenForm(item)}
                  className="material-symbols-outlined text-[18px] cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  edit
                </button>
                <button
                  onClick={() => confirmDelete(item)}
                  className="material-symbols-outlined text-[18px] cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ color: "var(--color-admin-error)" }}
                >
                  delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL FORM (Diperbaiki) */}
      {showFormModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFormModal(false)}
          />
          <div
            className="relative border z-10 p-8 shadow-2xl"
            style={{
              width: "100%",
              maxWidth: "450px", // Ini memastikan lebar modal proporsional dan tidak tergencet
              backgroundColor:
                "var(--color-admin-surface-container-lowest, #ffffff)",
              borderColor: "var(--color-admin-outline-variant, #e5e7eb)",
            }}
          >
            <h2
              className="font-admin-headline-md mb-6"
              style={{ color: "var(--color-admin-on-surface)" }}
            >
              {selectedItem ? `Edit ${title}` : `Add ${title}`}
            </h2>

            {errorMsg && (
              <div className="mb-5 p-3 bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-5 mb-8 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label
                  className="font-admin-label text-[10px] tracking-widest"
                  style={{ color: "var(--color-admin-primary)" }}
                >
                  NAMA *
                </label>
                <input
                  type="text"
                  value={formData[dataKey]}
                  onChange={(e) =>
                    setFormData({ ...formData, [dataKey]: e.target.value })
                  }
                  className="w-full bg-transparent font-admin-body-md outline-none py-2 border-b transition-colors"
                  style={{
                    borderColor: "var(--color-admin-outline-variant, #ccc)",
                    color: "var(--color-admin-on-surface)",
                  }}
                  placeholder={`Masukkan nama ${title.toLowerCase()}`}
                />
              </div>

              {dataKey === "namaNegara" && (
                <div className="flex flex-col gap-2 w-full">
                  <label
                    className="font-admin-label text-[10px] tracking-widest"
                    style={{ color: "var(--color-admin-primary)" }}
                  >
                    KODE NEGARA
                  </label>
                  <input
                    type="text"
                    value={formData.kodeNegara}
                    onChange={(e) =>
                      setFormData({ ...formData, kodeNegara: e.target.value })
                    }
                    className="w-full bg-transparent font-admin-body-md outline-none py-2 border-b transition-colors"
                    style={{
                      borderColor: "var(--color-admin-outline-variant, #ccc)",
                      color: "var(--color-admin-on-surface)",
                    }}
                    placeholder="Contoh: ID, KR, JP"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2 w-full">
              <button
                onClick={() => setShowFormModal(false)}
                className="px-6 py-2.5 border font-admin-label text-[10px] tracking-widest cursor-pointer hover:opacity-70 transition-opacity"
                style={{
                  borderColor: "var(--color-admin-on-surface)",
                  color: "var(--color-admin-on-surface)",
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-6 py-2.5 font-admin-label text-[10px] tracking-widest cursor-pointer disabled:opacity-50 transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-admin-on-surface, #000)",
                  color: "var(--color-admin-surface, #fff)",
                }}
              >
                {isSubmitting ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL (Diperbaiki) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          />
          <div
            className="relative border p-8 flex flex-col items-center text-center z-10 shadow-2xl"
            style={{
              width: "100%",
              maxWidth: "400px", // Ini menjaga lebarnya agar proporsional
              backgroundColor:
                "var(--color-admin-surface-container-lowest, #ffffff)",
              borderColor: "var(--color-admin-outline-variant, #e5e7eb)",
            }}
          >
            <span
              className="material-symbols-outlined text-[36px] mb-4"
              style={{ color: "var(--color-admin-error, #dc2626)" }}
            >
              warning
            </span>
            <h3
              className="font-admin-headline-md mb-2"
              style={{ color: "var(--color-admin-on-surface)" }}
            >
              Hapus Data?
            </h3>
            <p
              className="font-admin-body-md text-[13px] mb-6"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              Data ini akan dihapus secara permanen dari sistem.
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-11 border font-admin-label text-[10px] tracking-widest cursor-pointer hover:opacity-70 transition-opacity"
                style={{
                  borderColor: "var(--color-admin-on-surface)",
                  color: "var(--color-admin-on-surface)",
                }}
              >
                BATAL
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 h-11 font-admin-label text-[10px] tracking-widest cursor-pointer disabled:opacity-50 transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-admin-error, #dc2626)",
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
