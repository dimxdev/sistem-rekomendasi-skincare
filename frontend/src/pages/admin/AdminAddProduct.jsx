import { useState, useRef } from "react";
import AdminSidebar from "../../components/AdminSidebar";

// ── Constants ──────────────────────────────────────────────
const PRODUCT_TYPES = ["Cleanser", "Toner", "Serum", "Essence", "Moisturizer", "Mask", "Sunscreen", "Treatment", "Eye Cream", "Exfoliant"];
const SKIN_TYPES = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
const SKIN_CONCERNS = ["Acne", "Dullness", "Anti-Aging", "Hyperpigmentation", "Hydration", "Redness", "Dark Spots", "Pores", "Sensitivity"];
const COUNTRIES = ["South Korea", "Japan", "France", "USA", "UK", "Canada", "Italy", "Australia"];


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
function AdminInput({ label, value, onChange, placeholder, type = "text", hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-admin-label text-[10px]" style={{ color: "var(--color-admin-primary-container)" }}>
        {label}
      </label>
      <div
        className="transition-colors duration-200"
        style={{ borderBottom: `1px solid ${focused ? "var(--color-admin-primary-container)" : "var(--color-admin-outline-variant)"}` }}
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
      {hint && <p className="font-admin-data text-[11px]" style={{ color: "var(--color-admin-on-surface-variant)" }}>{hint}</p>}
    </div>
  );
}

// ── Textarea Component ─────────────────────────────────────
function AdminTextarea({ label, value, onChange, placeholder, rows = 4 }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-admin-label text-[10px]" style={{ color: "var(--color-admin-primary-container)" }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-transparent font-admin-body-md outline-none p-3 resize-none placeholder:opacity-40 transition-colors duration-200"
        style={{
          color: "var(--color-admin-on-surface)",
          border: `1px solid ${focused ? "var(--color-admin-primary-container)" : "var(--color-admin-outline-variant)"}`,
        }}
      />
    </div>
  );
}

// ── Toggle Chip ────────────────────────────────────────────
function ToggleChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 font-admin-label text-[10px] tracking-widest border transition-colors cursor-pointer"
      style={{
        borderColor: active ? "var(--color-admin-primary)" : "var(--color-admin-outline-variant)",
        backgroundColor: active ? "var(--color-admin-primary)" : "transparent",
        color: active ? "var(--color-admin-on-primary)" : "var(--color-admin-on-surface-variant)",
      }}
    >
      {label}
    </button>
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
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [visibility, setVisibility] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    brand: "LUMIÈRE",
    country: "",
    type: "",
    shortDesc: "",
    fullDesc: "",
    ingredients: "",
    howToUse: "",
    purchaseUrl: "",
  });
  const [skinTypes, setSkinTypes] = useState([]);
  const [concerns, setConcerns] = useState([]);

  const setField = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const toggleSkinType = (t) => setSkinTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const toggleConcern = (c) => setConcerns((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const handleFileChange = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  return (
    <div className="admin min-h-screen" style={{ backgroundColor: "var(--color-admin-background)" }}>
      <AdminSidebar activePage="products" />

      <main className="min-h-screen" style={{ marginLeft: "var(--admin-sidebar-width)" }}>

        {/* Top Action Bar */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-10 py-4 border-b"
          style={{
            backgroundColor: "var(--color-admin-surface-container-lowest)",
            borderColor: "var(--color-admin-outline-variant)",
          }}
        >
          <div className="flex items-center gap-2 font-admin-data text-[12px]" style={{ color: "var(--color-admin-on-surface-variant)" }}>
            <button className="hover:underline cursor-pointer transition-colors" style={{ color: "var(--color-admin-on-surface-variant)" }}>
              Products
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span style={{ color: "var(--color-admin-on-surface)" }}>Add New Product</span>
          </div>
          <div className="flex gap-3">
            <button
              className="px-6 py-2.5 border font-admin-label tracking-widest transition-colors cursor-pointer hover:opacity-80"
              style={{ borderColor: "var(--color-admin-on-surface)", color: "var(--color-admin-on-surface)" }}
            >
              CANCEL
            </button>
            <button
              className="px-6 py-2.5 font-admin-label tracking-widest transition-opacity cursor-pointer hover:opacity-90"
              style={{ backgroundColor: "var(--color-admin-on-surface)", color: "var(--color-admin-surface)" }}
            >
              SAVE PRODUCT
            </button>
          </div>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT — Form Steps */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Page Title */}
            <div>
              <p className="font-admin-label mb-1" style={{ color: "var(--color-admin-primary)" }}>NEW ENTRY</p>
              <h1 className="font-admin-display-lg" style={{ color: "var(--color-admin-on-surface)" }}>Add Product</h1>
              <p className="font-admin-body-md mt-1" style={{ color: "var(--color-admin-on-surface-variant)" }}>
                Fill in product details to add to the collection
              </p>
            </div>

            {/* STEP 01 — Basic Info */}
            <SectionCard>
              <div className="flex items-center mb-6">
                <StepBadge number={1} />
                <h2 className="font-admin-headline-md" style={{ color: "var(--color-admin-on-surface)" }}>Basic Info</h2>
              </div>
              <div className="flex flex-col gap-5">
                <AdminInput label="PRODUCT NAME" value={form.name} onChange={setField("name")} placeholder="e.g. Radiance Serum" />
                <div className="grid grid-cols-2 gap-5">
                  <AdminInput label="BRAND" value={form.brand} onChange={setField("brand")} placeholder="e.g. LUMIÈRE" />
                  {/* Country select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-admin-label text-[10px]" style={{ color: "var(--color-admin-primary-container)" }}>
                      COUNTRY OF ORIGIN
                    </label>
                    <div style={{ borderBottom: "1px solid var(--color-admin-outline-variant)" }}>
                      <input
                        list="countries"
                        value={form.country}
                        onChange={(e) => setField("country")(e.target.value)}
                        placeholder="e.g. France"
                        className="w-full bg-transparent font-admin-body-md outline-none py-2 placeholder:opacity-40"
                        style={{ color: "var(--color-admin-on-surface)" }}
                      />
                      <datalist id="countries">
                        {COUNTRIES.map((c) => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                  </div>
                </div>
                {/* Product Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-admin-label text-[10px]" style={{ color: "var(--color-admin-primary-container)" }}>
                    PRODUCT TYPE
                  </label>
                  <div
                    className="relative flex items-center"
                    style={{ borderBottom: "1px solid var(--color-admin-outline-variant)" }}
                  >
                    <select
                      value={form.type}
                      onChange={(e) => setField("type")(e.target.value)}
                      className="w-full appearance-none bg-transparent font-admin-body-md outline-none py-2 pr-8 cursor-pointer"
                      style={{ color: form.type ? "var(--color-admin-on-surface)" : "var(--color-admin-on-surface-variant)" }}
                    >
                      <option value="" disabled>Select type...</option>
                      {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span
                      className="material-symbols-outlined text-[18px] absolute right-0 pointer-events-none"
                      style={{ color: "var(--color-admin-on-surface-variant)" }}
                    >
                      keyboard_arrow_down
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* STEP 02 — Skin Compatibility */}
            <SectionCard>
              <div className="flex items-center mb-6">
                <StepBadge number={2} />
                <h2 className="font-admin-headline-md" style={{ color: "var(--color-admin-on-surface)" }}>Skin Compatibility</h2>
              </div>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="font-admin-label text-[10px] mb-3" style={{ color: "var(--color-admin-primary-container)" }}>
                    SKIN TYPES
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_TYPES.map((t) => (
                      <ToggleChip key={t} label={t.toUpperCase()} active={skinTypes.includes(t)} onClick={() => toggleSkinType(t)} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-admin-label text-[10px] mb-3" style={{ color: "var(--color-admin-primary-container)" }}>
                    PRIMARY CONCERNS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_CONCERNS.map((c) => (
                      <ToggleChip key={c} label={c.toUpperCase()} active={concerns.includes(c)} onClick={() => toggleConcern(c)} />
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* STEP 03 — Description */}
            <SectionCard>
              <div className="flex items-center mb-6">
                <StepBadge number={3} />
                <h2 className="font-admin-headline-md" style={{ color: "var(--color-admin-on-surface)" }}>Description</h2>
              </div>
              <div className="flex flex-col gap-5">
                <AdminInput
                  label="SHORT DESCRIPTION"
                  value={form.shortDesc}
                  onChange={setField("shortDesc")}
                  placeholder="A brief one-liner summarizing the product."
                />
                <AdminTextarea
                  label="FULL DESCRIPTION"
                  value={form.fullDesc}
                  onChange={setField("fullDesc")}
                  placeholder="Detailed product information..."
                  rows={5}
                />
                <AdminTextarea
                  label="KEY INGREDIENTS"
                  value={form.ingredients}
                  onChange={setField("ingredients")}
                  placeholder="Comma separated list of key ingredients."
                  rows={3}
                />
                <AdminTextarea
                  label="HOW TO USE"
                  value={form.howToUse}
                  onChange={setField("howToUse")}
                  placeholder="Application instructions."
                  rows={3}
                />
              </div>
            </SectionCard>

            {/* STEP 04 — Marketplace */}
            <SectionCard>
              <div className="flex items-center mb-6">
                <StepBadge number={4} />
                <h2 className="font-admin-headline-md" style={{ color: "var(--color-admin-on-surface)" }}>Marketplace</h2>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-admin-label text-[10px]" style={{ color: "var(--color-admin-primary-container)" }}>
                  PURCHASE URL
                </label>
                <div
                  className="flex items-center gap-2 transition-colors duration-200"
                  style={{ borderBottom: "1px solid var(--color-admin-outline-variant)" }}
                >
                  <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--color-admin-on-surface-variant)" }}>
                    link
                  </span>
                  <input
                    type="url"
                    value={form.purchaseUrl}
                    onChange={(e) => setField("purchaseUrl")(e.target.value)}
                    placeholder="https://"
                    className="flex-1 bg-transparent font-admin-body-md outline-none py-2 placeholder:opacity-40"
                    style={{ color: "var(--color-admin-on-surface)" }}
                  />
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
              <p className="font-admin-label text-[10px] mb-4" style={{ color: "var(--color-admin-primary-container)" }}>
                PRODUCT IMAGERY
              </p>

              {/* Upload Zone */}
              <div
                className="border-2 border-dashed mb-3 flex flex-col items-center justify-center p-6 cursor-pointer transition-colors"
                style={{
                  borderColor: isDragging ? "var(--color-admin-primary)" : "var(--color-admin-outline-variant)",
                  backgroundColor: isDragging ? "var(--color-admin-surface-container-low)" : "transparent",
                  minHeight: "140px",
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <span
                  className="material-symbols-outlined text-[32px] mb-2"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  cloud_upload
                </span>
                <p className="font-admin-body-md text-[13px] text-center" style={{ color: "var(--color-admin-on-surface-variant)" }}>
                  Click to upload or drag and drop
                </p>
                <p className="font-admin-data text-[11px] mt-1" style={{ color: "var(--color-admin-outline)" }}>
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
                <div className="relative border" style={{ borderColor: "var(--color-admin-outline-variant)" }}>
                  <img src={uploadedImage} alt="Preview" className="w-full h-40 object-cover" />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "var(--color-admin-surface-container-lowest)", border: "1px solid var(--color-admin-outline-variant)" }}
                  >
                    <span className="material-symbols-outlined text-[14px]" style={{ color: "var(--color-admin-error)" }}>delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Visibility Toggle */}
            <div
              className="border p-6"
              style={{
                backgroundColor: "var(--color-admin-surface-container-lowest)",
                borderColor: "var(--color-admin-outline-variant)",
              }}
            >
              <p className="font-admin-label text-[10px] mb-3" style={{ color: "var(--color-admin-primary-container)" }}>
                VISIBILITY
              </p>
              <div className="flex items-center justify-between">
                <p className="font-admin-body-md" style={{ color: "var(--color-admin-on-surface-variant)" }}>
                  {visibility ? "Active — visible to users" : "Hidden — not visible"}
                </p>
                {/* Toggle */}
                <button
                  onClick={() => setVisibility(!visibility)}
                  className="w-11 h-6 relative cursor-pointer transition-colors duration-200"
                  style={{
                    backgroundColor: visibility ? "var(--color-admin-primary)" : "var(--color-admin-outline-variant)",
                    borderRadius: "999px",
                  }}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 transition-all duration-200"
                    style={{
                      left: visibility ? "calc(100% - 22px)" : "2px",
                      backgroundColor: "white",
                      borderRadius: "999px",
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div
              className="border p-6"
              style={{
                backgroundColor: "var(--color-admin-surface-container-lowest)",
                borderColor: "#8B3A3A",
              }}
            >
              <p className="font-admin-label text-[10px] mb-2" style={{ color: "#8B3A3A" }}>
                DANGER ZONE
              </p>
              <p className="font-admin-body-md text-[13px] mb-4" style={{ color: "var(--color-admin-on-surface-variant)" }}>
                Once you delete a product, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 border font-admin-label text-[10px] tracking-widest cursor-pointer transition-opacity hover:opacity-80"
                style={{ borderColor: "#8B3A3A", color: "#8B3A3A" }}
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                DELETE PRODUCT
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div
            className="relative w-[480px] border p-12 flex flex-col items-center text-center z-10"
            style={{ backgroundColor: "var(--color-admin-surface-container-lowest)", borderColor: "var(--color-admin-outline-variant)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-6">
              <path d="M12 2L1 21h22L12 2z" stroke="#8B3A3A" strokeWidth="1.5" strokeLinejoin="miter" />
              <path d="M12 9v5" stroke="#8B3A3A" strokeWidth="1.5" strokeLinecap="square" />
              <circle cx="12" cy="17" r="0.5" fill="#8B3A3A" stroke="#8B3A3A" strokeWidth="1" />
            </svg>
            <h2 className="font-admin-headline-md mb-3" style={{ color: "var(--color-admin-on-surface)" }}>
              Delete this product?
            </h2>
            <p className="font-admin-body-md mb-6 max-w-[320px]" style={{ color: "var(--color-admin-on-surface-variant)" }}>
              This action cannot be undone. The product will be permanently removed from the collection.
            </p>
            <div
              className="w-full p-3 mb-6"
              style={{ backgroundColor: "var(--color-admin-surface-container-low)", borderLeft: "2px solid #8B3A3A" }}
            >
              <p className="font-admin-body-md text-[12px] italic" style={{ color: "var(--color-admin-on-surface-variant)" }}>
                Consider hiding this product instead to preserve user favorites.
              </p>
            </div>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-11 border font-admin-label tracking-widest cursor-pointer transition-colors hover:opacity-80"
                style={{ borderColor: "var(--color-admin-on-surface)", color: "var(--color-admin-on-surface)" }}
              >
                CANCEL
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-11 font-admin-label tracking-widest cursor-pointer hover:opacity-90"
                style={{ backgroundColor: "#8B3A3A", color: "#ffffff" }}
              >
                DELETE PERMANENTLY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}