import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { deleteProduct, getProducts } from "../../api/products";
import {
  getCountries,
  getProductTypes,
  getSkinTypes,
  getConcerns,
} from "../../api/masterData";

const PER_PAGE = 8;

function StatusChip() {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 font-admin-label text-[10px]"
      style={{ backgroundColor: "rgba(74,107,74,0.1)", color: "#4a6b4a" }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#4a6b4a]" />
      Active
    </span>
  );
}

function FilterSelect({ value, onChange, options, labelKey = "nama", idKey = "nama" }) {
  return (
    <div
      className="relative flex items-center gap-1 px-3 py-2 border cursor-pointer"
      style={{
        borderColor: "var(--color-admin-outline-variant)",
        backgroundColor: "var(--color-admin-surface-container-lowest)",
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent font-admin-data text-[12px] outline-none cursor-pointer pr-4"
        style={{ color: "var(--color-admin-on-surface)" }}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.id} value={option[idKey]}>
            {option[labelKey]}
          </option>
        ))}
      </select>
      <span
        className="material-symbols-outlined text-[14px] absolute right-2 pointer-events-none"
        style={{ color: "var(--color-admin-on-surface-variant)" }}
      >
        keyboard_arrow_down
      </span>
    </div>
  );
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [skinType, setSkinType] = useState("");
  const [concern, setConcern] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PER_PAGE,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(country ? { country } : {}),
      ...(type ? { type } : {}),
      ...(skinType ? { skinType } : {}),
      ...(concern ? { concern } : {}),
    }),
    [page, search, country, type, skinType, concern],
  );

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const res = await getProducts(queryParams);
      setProducts(res.data || []);
      setPagination(res.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Gagal memuat produk.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

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
        setSkinTypes(skinTypeRes.data || []);
        setConcerns(concernRes.data || []);
      } catch {
        setErrorMsg("Gagal memuat filter master data.");
      }
    };

    fetchMasterData();
  }, []);

  const resetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Gagal menghapus produk.");
    } finally {
      setIsDeleting(false);
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
        style={{ marginLeft: "var(--admin-sidebar-width)", padding: "40px" }}
      >
        <div className="flex items-start justify-between mb-8">
          <div>
            <p
              className="font-admin-label mb-1"
              style={{ color: "var(--color-admin-primary)" }}
            >
              CATALOG MANAGEMENT
            </p>
            <h1
              className="font-admin-display-lg"
              style={{ color: "var(--color-admin-on-surface)" }}
            >
              Products
            </h1>
            <p
              className="font-admin-body-md mt-1"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              {pagination.total} products in your curated collection
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/addproduct")}
            className="flex items-center gap-2 px-6 py-3 font-admin-label tracking-widest transition-opacity hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: "var(--color-admin-primary)",
              color: "var(--color-admin-on-primary)",
            }}
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            ADD NEW PRODUCT
          </button>
        </div>

        <div
          className="flex flex-wrap items-center gap-3 p-4 border border-b-0"
          style={{
            backgroundColor: "var(--color-admin-surface-container-lowest)",
            borderColor: "var(--color-admin-outline-variant)",
          }}
        >
          <div
            className="flex items-center gap-2 flex-1 min-w-[220px] border-b pb-1"
            style={{ borderColor: "var(--color-admin-outline-variant)" }}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => resetPage(setSearch)(e.target.value)}
              className="bg-transparent font-admin-body-md outline-none flex-1"
              style={{ color: "var(--color-admin-on-surface)" }}
            />
          </div>

          <FilterSelect
            value={country}
            onChange={resetPage(setCountry)}
            options={countries}
            labelKey="namaNegara"
            idKey="namaNegara"
          />
          <FilterSelect
            value={type}
            onChange={resetPage(setType)}
            options={productTypes}
          />
          <FilterSelect
            value={skinType}
            onChange={resetPage(setSkinType)}
            options={skinTypes}
          />
          <FilterSelect
            value={concern}
            onChange={resetPage(setConcern)}
            options={concerns}
          />
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 text-sm border border-red-300">
            {errorMsg}
          </div>
        )}

        <div
          className="border"
          style={{
            backgroundColor: "var(--color-admin-surface-container-lowest)",
            borderColor: "var(--color-admin-outline-variant)",
          }}
        >
          <div
            className="grid items-center px-4 py-3 border-b"
            style={{
              gridTemplateColumns: "1.5fr 140px 120px 120px 90px 100px",
              borderColor: "var(--color-admin-outline-variant)",
              backgroundColor: "var(--color-admin-surface-container-low)",
            }}
          >
            {["PRODUCT", "BRAND", "COUNTRY", "TYPE", "STATUS", "ACTIONS"].map(
              (header) => (
                <span
                  key={header}
                  className="font-admin-label text-[10px]"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  {header}
                </span>
              ),
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <p className="font-admin-body-md text-gray-500">
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="font-admin-body-md text-gray-500">
                No products found.
              </p>
            </div>
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                className="grid items-center px-4 py-3"
                style={{
                  gridTemplateColumns: "1.5fr 140px 120px 120px 90px 100px",
                  borderBottom:
                    index < products.length - 1
                      ? "1px solid var(--color-admin-outline-variant)"
                      : "none",
                }}
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <div
                    className="w-10 h-10 flex-shrink-0 overflow-hidden"
                    style={{
                      backgroundColor: "var(--color-admin-surface-container)",
                      border: "1px solid var(--color-admin-outline-variant)",
                    }}
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.namaProduk}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px] text-gray-400">
                          image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-admin-body-md truncate"
                      style={{ color: "var(--color-admin-on-surface)" }}
                    >
                      {product.namaProduk}
                    </p>
                    <p
                      className="font-admin-data text-[11px] truncate"
                      style={{
                        color: "var(--color-admin-on-surface-variant)",
                      }}
                    >
                      {product.manfaatUtama}
                    </p>
                  </div>
                </div>

                <span className="font-admin-body-md">{product.brand}</span>
                <span className="font-admin-body-md">
                  {product.country?.namaNegara || "-"}
                </span>
                <span className="font-admin-body-md">
                  {product.productType?.nama || "-"}
                </span>
                <StatusChip />
                <div className="flex items-center gap-2">
                  <button
                    className="material-symbols-outlined text-[18px] cursor-pointer hover:opacity-70"
                    style={{ color: "var(--color-admin-on-surface-variant)" }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    visibility
                  </button>
                  <button
                    className="material-symbols-outlined text-[18px] cursor-pointer hover:opacity-70"
                    style={{ color: "var(--color-admin-error)" }}
                    onClick={() => setDeleteTarget(product)}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))
          )}

          <div
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{
              borderColor: "var(--color-admin-outline-variant)",
              backgroundColor: "var(--color-admin-surface-container-low)",
            }}
          >
            <span
              className="font-admin-data text-[12px]"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              Page {page} of {pagination.totalPages || 1}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-3 py-2 border font-admin-label text-[10px] disabled:opacity-40"
              >
                PREV
              </button>
              <button
                onClick={() =>
                  setPage((prev) =>
                    Math.min(pagination.totalPages || 1, prev + 1),
                  )
                }
                disabled={page >= (pagination.totalPages || 1)}
                className="px-3 py-2 border font-admin-label text-[10px] disabled:opacity-40"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </main>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteTarget(null)}
          />
          <div
            className="relative w-[420px] border p-8 z-10"
            style={{
              backgroundColor: "var(--color-admin-surface-container-lowest)",
              borderColor: "var(--color-admin-outline-variant)",
            }}
          >
            <h2 className="font-admin-headline-md mb-3">Delete product?</h2>
            <p className="font-admin-body-md mb-6 text-gray-500">
              {deleteTarget.namaProduk} akan dihapus permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-10 border font-admin-label text-[10px]"
              >
                CANCEL
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 h-10 font-admin-label text-[10px] disabled:opacity-50"
                style={{ backgroundColor: "#8B3A3A", color: "#ffffff" }}
              >
                {isDeleting ? "DELETING..." : "DELETE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
