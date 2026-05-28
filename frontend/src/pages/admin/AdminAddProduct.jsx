import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { createAdminProduct } from "../../api/adminProducts";
import {
  getConcerns,
  getCountries,
  getProductTypes,
  getSkinTypes,
} from "../../api/masterData";

// ── Step Badge ─────────────────────────────────────────────
function StepBadge({ number }) {
  return (
    <span
      className="font-admin-label text-[9px] px-2 py-0.5 mr-3"
      style={{
        backgroundColor: "var(--color-admin-surface-container)",
        color: "var(--color-admin-primary)",
        border: "1px solid var(--color-admin-outline-variant)",
      }}
    >
      STEP {String(number).padStart(2, "0")}
    </span>
  );
}

// ── Input Component ────────────────────────────────────────
function AdminInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-admin-label text-[10px]"
        style={{ color: "var(--color-admin-primary-container)" }}
      >
        {label}
      </label>
      <div
        className="transition-colors duration-200"
        style={{
          borderBottom: `1px solid ${focused ? "var(--color-admin-primary-container)" : "var(--color-admin-outline-variant)"}`,
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent font-admin-body-md outline-none py-2 placeholder:opacity-40"
          style={{ color: "var(--color-admin-on-surface)" }}
        />
      </div>
      {hint && (
        <p
          className="font-admin-data text-[11px]"
          style={{ color: "var(--color-admin-on-surface-variant)" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Section Card ───────────────────────────────────────────
function SectionCard({ children }) {
  return (
    <div
      className="p-8 border"
      style={{
        backgroundColor: "var(--color-admin-surface-container-lowest)",
        borderColor: "var(--color-admin-outline-variant)",
      }}
    >
      {children}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────
export default function AdminAddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [options, setOptions] = useState({
    countries: [],
    productTypes: [],
    skinTypes: [],
    concerns: [],
  });

  // Form state
  const [form, setForm] = useState({
    name: "",
    brand: "",
    manfaatUtama: "",
    tokoOnlineUrl: "",
    imageUrl: "",
    countryId: "",
    productTypeId: "",
  });
  const [skinTypeIds, setSkinTypeIds] = useState([]);
  const [concernIds, setConcernIds] = useState([]);

  const setField = (key) => (val) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const toggleSelection = (listSetter, list, id) => {
    listSetter(
      list.includes(id) ? list.filter((item) => item !== id) : [...list, id],
    );
  };

  const handleFileChange = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageFile(file);
    setUploadedImage(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [countries, productTypes, skinTypes, concerns] =
          await Promise.all([
            getCountries(),
            getProductTypes(),
            getSkinTypes(),
            getConcerns(),
          ]);

        setOptions({
          countries: (Array.isArray(countries) ? countries : [])
            .map((item) => ({
              id: item.id,
              label: item.namaNegara || item.kodeNegara || "",
            }))
            .filter((item) => item.id && item.label),
          productTypes: (Array.isArray(productTypes) ? productTypes : [])
            .map((item) => ({ id: item.id, label: item.nama || "" }))
            .filter((item) => item.id && item.label),
          skinTypes: (Array.isArray(skinTypes) ? skinTypes : [])
            .map((item) => ({
              id: item.id,
              label: item.nama || "",
            }))
            .filter((item) => item.id && item.label),
          concerns: (Array.isArray(concerns) ? concerns : [])
            .map((item) => ({
              id: item.id,
              label: item.nama || "",
            }))
            .filter((item) => item.id && item.label),
        });
      } catch {
        // Leave empty options if load fails.
      }
    };

    loadOptions();
  }, []);

  const handleSave = async () => {
    setError("");

    if (
      !form.name ||
      !form.brand ||
      !form.manfaatUtama ||
      !form.tokoOnlineUrl ||
      !form.countryId ||
      !form.productTypeId
    ) {
      setError(
        "Nama produk, brand, manfaat utama, toko online, countryId, dan productTypeId wajib diisi.",
      );
      return;
    }

    const payload = new FormData();
    payload.append("namaProduk", form.name);
    payload.append("brand", form.brand);
    payload.append("manfaatUtama", form.manfaatUtama);
    payload.append("tokoOnlineUrl", form.tokoOnlineUrl);
    payload.append("countryId", form.countryId);
    payload.append("productTypeId", form.productTypeId);

    if (form.imageUrl) {
      payload.append("imageUrl", form.imageUrl);
    }

    if (skinTypeIds.length > 0) {
      payload.append("skinTypeIds", JSON.stringify(skinTypeIds));
    }

    if (concernIds.length > 0) {
      payload.append("concernIds", JSON.stringify(concernIds));
    }

    if (imageFile) {
      payload.append("image", imageFile);
    }

    setIsSaving(true);

    try {
      await createAdminProduct(payload);
      navigate("/admin/products");
    } catch (err) {
      setError(err?.response?.data?.error || "Gagal menambahkan produk.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="admin min-h-screen"
      style={{ backgroundColor: "var(--color-admin-background)" }}
    >
      <AdminSidebar activePage="products" />

      <main
        className="min-h-screen"
        style={{ marginLeft: "var(--admin-sidebar-width)" }}
      >
        {/* Top Action Bar */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-10 py-4 border-b"
          style={{
            backgroundColor: "var(--color-admin-surface-container-lowest)",
            borderColor: "var(--color-admin-outline-variant)",
          }}
        >
          <div
            className="flex items-center gap-2 font-admin-data text-[12px]"
            style={{ color: "var(--color-admin-on-surface-variant)" }}
          >
            <button
              className="hover:underline cursor-pointer transition-colors"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              Products
            </button>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span style={{ color: "var(--color-admin-on-surface)" }}>
              Add New Product
            </span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-6 py-2.5 border font-admin-label tracking-widest transition-colors cursor-pointer hover:opacity-80"
              style={{
                borderColor: "var(--color-admin-on-surface)",
                color: "var(--color-admin-on-surface)",
              }}
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 font-admin-label tracking-widest transition-opacity cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: "var(--color-admin-on-surface)",
                color: "var(--color-admin-surface)",
              }}
            >
              {isSaving ? "SAVING..." : "SAVE PRODUCT"}
            </button>
          </div>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT — Form Steps */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Page Title */}
            <div>
              <p
                className="font-admin-label mb-1"
                style={{ color: "var(--color-admin-primary)" }}
              >
                NEW ENTRY
              </p>
              <h1
                className="font-admin-display-lg"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                Add Product
              </h1>
              <p
                className="font-admin-body-md mt-1"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                Isi data produk sesuai payload backend
              </p>
            </div>

            {/* STEP 01 — Basic Info */}
            <SectionCard>
              {error && (
                <p
                  className="font-admin-body-md mb-4"
                  style={{ color: "var(--color-admin-error)" }}
                >
                  {error}
                </p>
              )}
              <div className="flex items-center mb-6">
                <StepBadge number={1} />
                <h2
                  className="font-admin-headline-md"
                  style={{ color: "var(--color-admin-on-surface)" }}
                >
                  Basic Info
                </h2>
              </div>
              <div className="flex flex-col gap-5">
                <AdminInput
                  label="NAMA PRODUK"
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="Some By Mi Serum"
                />
                <AdminInput
                  label="BRAND"
                  value={form.brand}
                  onChange={setField("brand")}
                  placeholder="Some By Mi"
                />
                <AdminInput
                  label="MANFAAT UTAMA"
                  value={form.manfaatUtama}
                  onChange={setField("manfaatUtama")}
                  placeholder="Mengatasi jerawat"
                />
                <AdminInput
                  label="TOKO ONLINE URL"
                  value={form.tokoOnlineUrl}
                  onChange={setField("tokoOnlineUrl")}
                  placeholder="https://shopee.co.id/xxx"
                  type="url"
                />
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-admin-label text-[10px]"
                      style={{ color: "var(--color-admin-primary-container)" }}
                    >
                      COUNTRY
                    </label>
                    <div
                      className="relative flex items-center"
                      style={{
                        borderBottom:
                          "1px solid var(--color-admin-outline-variant)",
                      }}
                    >
                      <select
                        value={form.countryId}
                        onChange={(e) => setField("countryId")(e.target.value)}
                        className="w-full appearance-none bg-transparent font-admin-body-md outline-none py-2 pr-8 cursor-pointer"
                        style={{
                          color: form.countryId
                            ? "var(--color-admin-on-surface)"
                            : "var(--color-admin-on-surface-variant)",
                        }}
                      >
                        <option value="" disabled>
                          Select country...
                        </option>
                        {options.countries.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <span
                        className="material-symbols-outlined text-[18px] absolute right-0 pointer-events-none"
                        style={{
                          color: "var(--color-admin-on-surface-variant)",
                        }}
                      >
                        keyboard_arrow_down
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-admin-label text-[10px]"
                      style={{ color: "var(--color-admin-primary-container)" }}
                    >
                      PRODUCT TYPE
                    </label>
                    <div
                      className="relative flex items-center"
                      style={{
                        borderBottom:
                          "1px solid var(--color-admin-outline-variant)",
                      }}
                    >
                      <select
                        value={form.productTypeId}
                        onChange={(e) =>
                          setField("productTypeId")(e.target.value)
                        }
                        className="w-full appearance-none bg-transparent font-admin-body-md outline-none py-2 pr-8 cursor-pointer"
                        style={{
                          color: form.productTypeId
                            ? "var(--color-admin-on-surface)"
                            : "var(--color-admin-on-surface-variant)",
                        }}
                      >
                        <option value="" disabled>
                          Select type...
                        </option>
                        {options.productTypes.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <span
                        className="material-symbols-outlined text-[18px] absolute right-0 pointer-events-none"
                        style={{
                          color: "var(--color-admin-on-surface-variant)",
                        }}
                      >
                        keyboard_arrow_down
                      </span>
                    </div>
                  </div>
                </div>
                <AdminInput
                  label="IMAGE URL (optional)"
                  value={form.imageUrl}
                  onChange={setField("imageUrl")}
                  placeholder="https://image.jpg"
                  type="url"
                />

                <div className="flex flex-col gap-2">
                  <span
                    className="font-admin-label text-[10px]"
                    style={{ color: "var(--color-admin-primary-container)" }}
                  >
                    SKIN TYPES
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {options.skinTypes.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2 border px-3 py-2 cursor-pointer"
                        style={{
                          borderColor: skinTypeIds.includes(item.id)
                            ? "var(--color-admin-primary)"
                            : "var(--color-admin-outline-variant)",
                          backgroundColor: skinTypeIds.includes(item.id)
                            ? "var(--color-admin-primary)"
                            : "transparent",
                          color: skinTypeIds.includes(item.id)
                            ? "var(--color-admin-on-primary)"
                            : "var(--color-admin-on-surface-variant)",
                        }}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={skinTypeIds.includes(item.id)}
                          onChange={() =>
                            toggleSelection(
                              setSkinTypeIds,
                              skinTypeIds,
                              item.id,
                            )
                          }
                        />
                        <span className="font-admin-data text-[11px]">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span
                    className="font-admin-label text-[10px]"
                    style={{ color: "var(--color-admin-primary-container)" }}
                  >
                    SKIN CONCERNS
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {options.concerns.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2 border px-3 py-2 cursor-pointer"
                        style={{
                          borderColor: concernIds.includes(item.id)
                            ? "var(--color-admin-primary)"
                            : "var(--color-admin-outline-variant)",
                          backgroundColor: concernIds.includes(item.id)
                            ? "var(--color-admin-primary)"
                            : "transparent",
                          color: concernIds.includes(item.id)
                            ? "var(--color-admin-on-primary)"
                            : "var(--color-admin-on-surface-variant)",
                        }}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={concernIds.includes(item.id)}
                          onChange={() =>
                            toggleSelection(setConcernIds, concernIds, item.id)
                          }
                        />
                        <span className="font-admin-data text-[11px]">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT — Sidebar Panels */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-[72px]">
            {/* Product Imagery */}
            <div
              className="border p-6"
              style={{
                backgroundColor: "var(--color-admin-surface-container-lowest)",
                borderColor: "var(--color-admin-outline-variant)",
              }}
            >
              <p
                className="font-admin-label text-[10px] mb-4"
                style={{ color: "var(--color-admin-primary-container)" }}
              >
                PRODUCT IMAGERY
              </p>

              {/* Upload Zone */}
              <div
                className="border-2 border-dashed mb-3 flex flex-col items-center justify-center p-6 cursor-pointer transition-colors"
                style={{
                  borderColor: isDragging
                    ? "var(--color-admin-primary)"
                    : "var(--color-admin-outline-variant)",
                  backgroundColor: isDragging
                    ? "var(--color-admin-surface-container-low)"
                    : "transparent",
                  minHeight: "140px",
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <span
                  className="material-symbols-outlined text-[32px] mb-2"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  cloud_upload
                </span>
                <p
                  className="font-admin-body-md text-[13px] text-center"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  Click to upload or drag and drop
                </p>
                <p
                  className="font-admin-data text-[11px] mt-1"
                  style={{ color: "var(--color-admin-outline)" }}
                >
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
              </div>

              {/* Uploaded Preview */}
              {uploadedImage && (
                <div
                  className="relative border"
                  style={{ borderColor: "var(--color-admin-outline-variant)" }}
                >
                  <img
                    src={uploadedImage}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor:
                        "var(--color-admin-surface-container-lowest)",
                      border: "1px solid var(--color-admin-outline-variant)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ color: "var(--color-admin-error)" }}
                    >
                      delete
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
