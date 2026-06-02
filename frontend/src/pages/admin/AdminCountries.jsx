import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} from "../../api/countries";

function AdminCountries() {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formMode, setFormMode] = useState("add"); // 'add' or 'edit'

  // Data State
  const [activeCountry, setActiveCountry] = useState(null);
  const [formData, setFormData] = useState({ namaNegara: "", kodeNegara: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCountries = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getCountries();
      setCountries(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Gagal memuat data negara.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const openAddModal = () => {
    setFormMode("add");
    setFormData({ namaNegara: "", kodeNegara: "" });
    setError("");
    setSuccess("");
    setShowFormModal(true);
  };

  const openEditModal = (country) => {
    setFormMode("edit");
    setActiveCountry(country);
    setFormData({
      namaNegara: country.namaNegara,
      kodeNegara: country.kodeNegara || "",
    });
    setError("");
    setSuccess("");
    setShowFormModal(true);
  };

  const openDeleteModal = (country) => {
    setActiveCountry(country);
    setError("");
    setSuccess("");
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const payload = {
        namaNegara: formData.namaNegara.trim(),
        kodeNegara: formData.kodeNegara.trim(),
      };

      if (formMode === "add") {
        await createCountry(payload);
        setSuccess("Negara berhasil ditambahkan.");
      } else {
        await updateCountry(activeCountry.id, payload);
        setSuccess("Negara berhasil diperbarui.");
      }
      setShowFormModal(false);
      fetchCountries();
    } catch (err) {
      setError(
        err?.response?.data?.error || "Terjadi kesalahan pada validasi data.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!activeCountry) return;
    setIsSubmitting(true);
    setError("");

    try {
      await deleteCountry(activeCountry.id);
      setSuccess(`Negara '${activeCountry.namaNegara}' berhasil dihapus.`);
      setShowDeleteModal(false);
      setActiveCountry(null);
      fetchCountries();
    } catch (err) {
      setError(err?.response?.data?.error || "Gagal menghapus data negara.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="admin min-h-screen"
      style={{ backgroundColor: "var(--color-admin-background)" }}
    >
      <AdminSidebar activePage="countries" />

      <main
        className="min-h-screen relative"
        style={{ marginLeft: "var(--admin-sidebar-width)", padding: "40px" }}
      >
        {/* Page Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p
              className="font-admin-label mb-1"
              style={{ color: "var(--color-admin-primary)" }}
            >
              MASTER DATA
            </p>
            <h1
              className="font-admin-display-lg"
              style={{ color: "var(--color-admin-on-surface)" }}
            >
              Countries
            </h1>
            <p
              className="font-admin-body-md mt-1"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              {countries.length} registered countries for product origin
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 font-admin-label tracking-widest transition-opacity hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: "var(--color-admin-primary)",
              color: "var(--color-admin-on-primary)",
            }}
            onClick={openAddModal}
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            ADD NEW COUNTRY
          </button>
        </div>

        {/* Global Notifications */}
        {error && !showFormModal && !showDeleteModal && (
          <div
            className="mb-6 p-4 border"
            style={{
              borderColor: "var(--color-admin-error)",
              backgroundColor: "rgba(139, 58, 58, 0.05)",
            }}
          >
            <p
              className="font-admin-body-md"
              style={{ color: "var(--color-admin-error)" }}
            >
              {error}
            </p>
          </div>
        )}
        {success && !showFormModal && !showDeleteModal && (
          <div
            className="mb-6 p-4 border"
            style={{
              borderColor: "var(--color-admin-primary)",
              backgroundColor: "rgba(74, 107, 74, 0.05)",
            }}
          >
            <p
              className="font-admin-body-md"
              style={{ color: "var(--color-admin-primary)" }}
            >
              {success}
            </p>
          </div>
        )}

        {/* Table */}
        <div
          className="border"
          style={{
            backgroundColor: "var(--color-admin-surface-container-lowest)",
            borderColor: "var(--color-admin-outline-variant)",
          }}
        >
          {/* Table Header */}
          <div
            className="grid items-center px-6 py-3 border-b"
            style={{
              gridTemplateColumns: "80px 1fr 1fr 120px",
              borderColor: "var(--color-admin-outline-variant)",
              backgroundColor: "var(--color-admin-surface-container-low)",
            }}
          >
            {["NO", "COUNTRY NAME", "COUNTRY CODE", "ACTIONS"].map((h) => (
              <span
                key={h}
                className="font-admin-label text-[10px]"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Table Rows */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <p
                className="font-admin-body-md"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                Memuat data negara...
              </p>
            </div>
          ) : countries.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p
                className="font-admin-body-md"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                No countries registered yet.
              </p>
            </div>
          ) : (
            countries.map((country, i) => (
              <div
                key={country.id}
                className="grid items-center px-6 py-4 transition-colors hover:bg-opacity-50"
                style={{
                  gridTemplateColumns: "80px 1fr 1fr 120px",
                  borderBottom:
                    i < countries.length - 1
                      ? `1px solid var(--color-admin-outline-variant)`
                      : "none",
                }}
              >
                {/* No */}
                <span
                  className="font-admin-data text-[12px]"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </span>

                {/* Name */}
                <span
                  className="font-admin-body-md font-medium"
                  style={{ color: "var(--color-admin-on-surface)" }}
                >
                  {country.namaNegara}
                </span>

                {/* Code */}
                <div>
                  {country.kodeNegara ? (
                    <span
                      className="font-admin-data text-[11px] px-2 py-1 border inline-block uppercase"
                      style={{
                        borderColor: "var(--color-admin-outline-variant)",
                        color: "var(--color-admin-on-surface-variant)",
                        backgroundColor:
                          "var(--color-admin-surface-container-low)",
                      }}
                    >
                      {country.kodeNegara}
                    </span>
                  ) : (
                    <span
                      className="font-admin-body-md italic"
                      style={{
                        color: "var(--color-admin-on-surface-variant)",
                        opacity: 0.5,
                      }}
                    >
                      N/A
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    className="material-symbols-outlined text-[18px] cursor-pointer transition-colors hover:opacity-70"
                    style={{ color: "var(--color-admin-on-surface-variant)" }}
                    onClick={() => openEditModal(country)}
                    title="Edit Country"
                  >
                    edit
                  </button>
                  <button
                    className="material-symbols-outlined text-[18px] cursor-pointer transition-colors hover:opacity-70"
                    style={{ color: "var(--color-admin-error)" }}
                    onClick={() => openDeleteModal(country)}
                    title="Delete Country"
                  >
                    delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Form Modal (Add / Edit) */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isSubmitting && setShowFormModal(false)}
          />
          <div
            className="relative w-[480px] border p-8 flex flex-col z-10 shadow-2xl"
            style={{
              backgroundColor: "var(--color-admin-surface-container-lowest)",
              borderColor: "var(--color-admin-outline-variant)",
            }}
          >
            <div
              className="flex justify-between items-center mb-6 border-b pb-4"
              style={{ borderColor: "var(--color-admin-outline-variant)" }}
            >
              <h2
                className="font-admin-headline-md uppercase tracking-wider"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                {formMode === "add" ? "ADD NEW COUNTRY" : "EDIT COUNTRY"}
              </h2>
              <button
                onClick={() => !isSubmitting && setShowFormModal(false)}
                className="material-symbols-outlined"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                close
              </button>
            </div>

            {error && (
              <div
                className="mb-4 p-3 border"
                style={{
                  borderColor: "var(--color-admin-error)",
                  backgroundColor: "rgba(139, 58, 58, 0.05)",
                }}
              >
                <p
                  className="font-admin-body-md text-[13px]"
                  style={{ color: "var(--color-admin-error)" }}
                >
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label
                  className="font-admin-label text-[10px]"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  COUNTRY NAME{" "}
                  <span style={{ color: "var(--color-admin-error)" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaNegara}
                  onChange={(e) =>
                    setFormData({ ...formData, namaNegara: e.target.value })
                  }
                  placeholder="e.g. South Korea"
                  className="w-full px-3 py-2.5 border bg-transparent font-admin-body-md outline-none"
                  style={{
                    borderColor: "var(--color-admin-outline-variant)",
                    color: "var(--color-admin-on-surface)",
                  }}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  className="font-admin-label text-[10px]"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  COUNTRY CODE (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={formData.kodeNegara}
                  onChange={(e) =>
                    setFormData({ ...formData, kodeNegara: e.target.value })
                  }
                  placeholder="e.g. KR"
                  maxLength={5}
                  className="w-full px-3 py-2.5 border bg-transparent font-admin-body-md outline-none uppercase"
                  style={{
                    borderColor: "var(--color-admin-outline-variant)",
                    color: "var(--color-admin-on-surface)",
                  }}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 h-11 border font-admin-label tracking-widest cursor-pointer transition-colors hover:opacity-80"
                  style={{
                    borderColor: "var(--color-admin-outline-variant)",
                    color: "var(--color-admin-on-surface-variant)",
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 font-admin-label tracking-widest cursor-pointer transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "var(--color-admin-primary)",
                    color: "var(--color-admin-on-primary)",
                  }}
                >
                  {isSubmitting ? "SAVING..." : "SAVE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Match with AdminProducts) */}
      {showDeleteModal && activeCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isSubmitting && setShowDeleteModal(false)}
          />
          <div
            className="relative w-[480px] border p-12 flex flex-col items-center text-center z-10 shadow-2xl"
            style={{
              backgroundColor: "var(--color-admin-surface-container-lowest)",
              borderColor: "var(--color-admin-outline-variant)",
            }}
          >
            {/* Warning Icon */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="mb-6"
            >
              <path
                d="M12 2L1 21h22L12 2z"
                stroke="#8B3A3A"
                strokeWidth="1.5"
                strokeLinejoin="miter"
              />
              <path
                d="M12 9v5"
                stroke="#8B3A3A"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
              <circle
                cx="12"
                cy="17"
                r="0.5"
                fill="#8B3A3A"
                stroke="#8B3A3A"
                strokeWidth="1"
              />
            </svg>

            <h2
              className="font-admin-headline-md mb-3"
              style={{ color: "var(--color-admin-on-surface)" }}
            >
              Delete this country?
            </h2>
            <p
              className="font-admin-body-md mb-6 max-w-[320px]"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              You're about to permanently remove '{activeCountry.namaNegara}'
              from the master data. This action cannot be undone.
            </p>

            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
                className="flex-1 h-11 border font-admin-label tracking-widest cursor-pointer transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--color-admin-outline-variant)",
                  color: "var(--color-admin-on-surface-variant)",
                }}
              >
                CANCEL
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="flex-1 h-11 font-admin-label tracking-widest cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#8B3A3A", color: "#ffffff" }}
              >
                {isSubmitting ? "DELETING..." : "DELETE PERMANENTLY"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCountries;
