import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { createProduct } from "../../api/products";
import {
  getCountries,
  getProductTypes,
  getSkinTypes,
  getConcerns,
} from "../../api/masterData";

function AdminInput({ label, value, onChange, placeholder, type = "text" }) {
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
        style={{
          borderBottom: `1px solid ${
            focused
              ? "var(--color-admin-primary-container)"
              : "var(--color-admin-outline-variant)"
          }`,
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
    </div>
  );
}

function AdminTextarea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-admin-label text-[10px]"
        style={{ color: "var(--color-admin-primary-container)" }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-transparent font-admin-body-md outline-none p-3 resize-none placeholder:opacity-40"
        style={{
          color: "var(--color-admin-on-surface)",
          border: "1px solid var(--color-admin-outline-variant)",
        }}
      />
    </div>
  );
}

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

function ToggleChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 font-admin-label text-[10px] tracking-widest border transition-colors cursor-pointer"
      style={{
        borderColor: active
          ? "var(--color-admin-primary)"
          : "var(--color-admin-outline-variant)",
        backgroundColor: active ? "var(--color-admin-primary)" : "transparent",
        color: active
          ? "var(--color-admin-on-primary)"
          : "var(--color-admin-on-surface-variant)",
      }}
    >
      {label}
    </button>
  );
}

function AdminSelect({ label, value, onChange, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-admin-label text-[10px]"
        style={{ color: "var(--color-admin-primary-container)" }}
      >
        {label}
      </label>
      <div
        className="relative flex items-center"
        style={{ borderBottom: "1px solid var(--color-admin-outline-variant)" }}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-transparent font-admin-body-md outline-none py-2 pr-8 cursor-pointer"
          style={{ color: "var(--color-admin-on-surface)" }}
        >
          {children}
        </select>
        <span
          className="material-symbols-outlined text-[18px] absolute right-0 pointer-events-none"
          style={{ color: "var(--color-admin-on-surface-variant)" }}
        >
          keyboard_arrow_down
        </span>
      </div>
    </div>
  );
}

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [skinTypeOptions, setSkinTypeOptions] = useState([]);
  const [concernOptions, setConcernOptions] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    namaProduk: "",
    brand: "",
    countryId: "",
    productTypeId: "",
    manfaatUtama: "",
    tokoOnlineUrl: "",
    imageUrl: "",
  });

  const setField = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleValue = (setter) => (id) =>
    setter((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [countryRes, typeRes, skinTypeRes, concernRes] =
          await Promise.all([
            getCountries(),
            getProductTypes(),
            getSkinTypes(),
            getConcerns(),
          ]);

        setCountries(countryRes.data || []);
        setProductTypes(typeRes.data || []);
        setSkinTypeOptions(skinTypeRes.data || []);
        setConcernOptions(concernRes.data || []);
      } catch {
        setErrorMsg("Gagal memuat master data produk.");
      }
    };

    fetchMasterData();
  }, []);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg("");
      await createProduct({
        namaProduk: form.namaProduk.trim(),
        brand: form.brand.trim(),
        manfaatUtama: form.manfaatUtama.trim(),
        tokoOnlineUrl: form.tokoOnlineUrl.trim(),
        imageUrl: form.imageUrl.trim() || null,
        countryId: form.countryId,
        productTypeId: form.productTypeId,
        skinTypeIds: skinTypes,
        concernIds: concerns,
      });
      navigate("/admin/products");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Gagal menyimpan produk.");
    } finally {
      setIsSubmitting(false);
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
              onClick={() => navigate("/admin/products")}
              className="hover:underline cursor-pointer"
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
              onClick={() => navigate("/admin/products")}
              className="px-6 py-2.5 border font-admin-label tracking-widest cursor-pointer"
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
              className="px-6 py-2.5 font-admin-label tracking-widest cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-admin-on-surface)",
                color: "var(--color-admin-surface)",
              }}
            >
              {isSubmitting ? "SAVING..." : "SAVE PRODUCT"}
            </button>
          </div>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
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
                Isi data sesuai schema backend produk.
              </p>
              {errorMsg && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm border border-red-300">
                  {errorMsg}
                </div>
              )}
            </div>

            <SectionCard>
              <h2 className="font-admin-headline-md mb-6">Basic Info</h2>
              <div className="flex flex-col gap-5">
                <AdminInput
                  label="PRODUCT NAME"
                  value={form.namaProduk}
                  onChange={setField("namaProduk")}
                  placeholder="COSRX Salicylic Acid Daily Gentle Cleanser"
                />
                <AdminInput
                  label="BRAND"
                  value={form.brand}
                  onChange={setField("brand")}
                  placeholder="COSRX"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AdminSelect
                    label="COUNTRY"
                    value={form.countryId}
                    onChange={setField("countryId")}
                  >
                    <option value="">Select country...</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.namaNegara}
                      </option>
                    ))}
                  </AdminSelect>
                  <AdminSelect
                    label="PRODUCT TYPE"
                    value={form.productTypeId}
                    onChange={setField("productTypeId")}
                  >
                    <option value="">Select type...</option>
                    {productTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.nama}
                      </option>
                    ))}
                  </AdminSelect>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <h2 className="font-admin-headline-md mb-6">
                Skin Compatibility
              </h2>
              <div className="flex flex-col gap-5">
                <div>
                  <p
                    className="font-admin-label text-[10px] mb-3"
                    style={{ color: "var(--color-admin-primary-container)" }}
                  >
                    SKIN TYPES
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skinTypeOptions.map((type) => (
                      <ToggleChip
                        key={type.id}
                        label={type.nama.toUpperCase()}
                        active={skinTypes.includes(type.id)}
                        onClick={() => toggleValue(setSkinTypes)(type.id)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p
                    className="font-admin-label text-[10px] mb-3"
                    style={{ color: "var(--color-admin-primary-container)" }}
                  >
                    SKIN CONCERNS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {concernOptions.map((concern) => (
                      <ToggleChip
                        key={concern.id}
                        label={concern.nama.toUpperCase()}
                        active={concerns.includes(concern.id)}
                        onClick={() => toggleValue(setConcerns)(concern.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <h2 className="font-admin-headline-md mb-6">Description</h2>
              <AdminTextarea
                label="MANFAAT UTAMA"
                value={form.manfaatUtama}
                onChange={setField("manfaatUtama")}
                placeholder="Membersihkan wajah dan membantu mengurangi jerawat"
                rows={5}
              />
            </SectionCard>

            <SectionCard>
              <h2 className="font-admin-headline-md mb-6">Marketplace</h2>
              <AdminInput
                label="STORE URL"
                value={form.tokoOnlineUrl}
                onChange={setField("tokoOnlineUrl")}
                placeholder="https://shopee.co.id"
                type="url"
              />
            </SectionCard>
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-[72px]">
            <SectionCard>
              <h2 className="font-admin-headline-md mb-6">Product Image</h2>
              <AdminInput
                label="IMAGE URL"
                value={form.imageUrl}
                onChange={setField("imageUrl")}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
              {form.imageUrl && (
                <div
                  className="mt-4 border overflow-hidden"
                  style={{ borderColor: "var(--color-admin-outline-variant)" }}
                >
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}
