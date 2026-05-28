import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { updateAdminProduct } from "../../api/adminProducts";
import { getProductDetail } from "../../api/products";
import {
  getConcerns,
  getCountries,
  getProductTypes,
  getSkinTypes,
} from "../../api/masterData";
import { resolveAssetUrl } from "../../lib/asset";

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
export default function AdminEditProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [product, productsResponse] = await Promise.all([
          getProductDetail(productId, { includeInactive: true }),
          Promise.all([
            getCountries(),
            getProductTypes(),
            getSkinTypes(),
            getConcerns(),
          ]),
        ]);

        const [countries, productTypes, skinTypes, concerns] = productsResponse;

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

        setForm({
          name: product?.namaProduk || "",
          brand: product?.brand || "",
          manfaatUtama: product?.manfaatUtama || "",
          tokoOnlineUrl: product?.tokoOnlineUrl || "",
          imageUrl: product?.imageUrl || "",
          countryId: product?.countryId || product?.country?.id || "",
          productTypeId:
            product?.productTypeId || product?.productType?.id || "",
        });

        setSkinTypeIds(
          (product?.skinTypes || [])
            .map((entry) => entry?.skinTypeId || entry?.skinType?.id)
            .filter(Boolean),
        );

        setConcernIds(
          (product?.concerns || [])
            .map((entry) => entry?.concernId || entry?.concern?.id)
            .filter(Boolean),
        );

        setUploadedImage(resolveAssetUrl(product?.imageUrl || null));
      } catch (err) {
        setError(err?.response?.data?.error || "Gagal memuat detail produk.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [productId]);

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
    payload.append("skinTypeIds", JSON.stringify(skinTypeIds));
    payload.append("concernIds", JSON.stringify(concernIds));

    if (form.imageUrl) {
      payload.append("imageUrl", form.imageUrl);
    }

    if (imageFile) {
      payload.append("image", imageFile);
    }

    setIsSaving(true);

    try {
      await updateAdminProduct(productId, payload);
      navigate("/admin/products");
    } catch (err) {
      setError(err?.response?.data?.error || "Gagal memperbarui produk.");
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
              Edit Product
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
              disabled={isSaving || isLoading}
              className="px-6 py-2.5 font-admin-label tracking-widest transition-opacity cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: "var(--color-admin-on-surface)",
                color: "var(--color-admin-surface)",
              }}
            >
              {isSaving ? "SAVING..." : "SAVE CHANGES"}
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
                PRODUCT UPDATE
              </p>
              <h1
                className="font-admin-display-lg"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                Edit Product
              </h1>
              <p
                className="font-admin-body-md mt-2 max-w-[500px]"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                Update the product details below. Any changes will be reflected
                instantly in the catalog.
              </p>
            </div>

            {error && (
              <div>
                <p
                  className="font-admin-body-md"
                  style={{ color: "var(--color-admin-error)" }}
                >
                  {error}
                </p>
              </div>
            )}

            {isLoading ? (
              <SectionCard>
                <p
                  className="font-admin-body-md"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  Memuat data produk...
                </p>
              </SectionCard>
            ) : (
              <SectionCard>
                <div className="flex items-center mb-6">
                  <StepBadge number={1} />
                  <h2
                    className="font-admin-headline-md"
                    style={{ color: "var(--color-admin-on-surface)" }}
                  >
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <AdminInput
                    label="PRODUCT NAME"
                    value={form.name}
                    onChange={setField("name")}
                    placeholder="Serum Vitamin C"
                  />
                  <AdminInput
                    label="BRAND"
                    value={form.brand}
                    onChange={setField("brand")}
                    placeholder="Skintific"
                  />
                </div>

                <div className="mt-5">
                  <AdminInput
                    label="BENEFITS"
                    value={form.manfaatUtama}
                    onChange={setField("manfaatUtama")}
                    placeholder="Mencerahkan & meratakan tekstur"
                    hint="Tuliskan manfaat utama produk"
                  />
                </div>

                <div className="mt-5">
                  <AdminInput
                    label="TOKO ONLINE URL"
                    value={form.tokoOnlineUrl}
                    onChange={setField("tokoOnlineUrl")}
                    placeholder="https://shopee.co.id/xxx"
                    type="url"
                  />
                  <div className="grid grid-cols-2 gap-5 mt-5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-admin-label text-[10px]"
                        style={{
                          color: "var(--color-admin-primary-container)",
                        }}
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
                          onChange={(e) =>
                            setField("countryId")(e.target.value)
                          }
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
                        style={{
                          color: "var(--color-admin-primary-container)",
                        }}
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
                  <div className="mt-5">
                    <AdminInput
                      label="IMAGE URL (optional)"
                      value={form.imageUrl}
                      onChange={setField("imageUrl")}
                      placeholder="https://image.jpg"
                      type="url"
                    />
                  </div>

                  <div className="flex flex-col gap-2 mt-5">
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

                  <div className="flex flex-col gap-2 mt-5">
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
                              toggleSelection(
                                setConcernIds,
                                concernIds,
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
                </div>
              </SectionCard>
            )}
          </div>

          {/* RIGHT — Upload */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <SectionCard>
              <div className="flex items-center mb-6">
                <StepBadge number={2} />
                <h2
                  className="font-admin-headline-md"
                  style={{ color: "var(--color-admin-on-surface)" }}
                >
                  Product Image
                </h2>
              </div>

              <div
                className="border border-dashed p-6 text-center transition-colors"
                style={{
                  borderColor: isDragging
                    ? "var(--color-admin-primary)"
                    : "var(--color-admin-outline-variant)",
                  backgroundColor: isDragging
                    ? "rgba(212, 210, 199, 0.2)"
                    : "transparent",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <span
                      className="material-symbols-outlined text-[30px]"
                      style={{ color: "var(--color-admin-outline)" }}
                    >
                      image
                    </span>
                    <p
                      className="font-admin-body-md"
                      style={{ color: "var(--color-admin-on-surface-variant)" }}
                    >
                      Drag & drop image here
                    </p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 w-full px-4 py-2.5 border font-admin-label tracking-widest transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--color-admin-on-surface)",
                  color: "var(--color-admin-on-surface)",
                }}
              >
                CHOOSE FILE
              </button>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}
