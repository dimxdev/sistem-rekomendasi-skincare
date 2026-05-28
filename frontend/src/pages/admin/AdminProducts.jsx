import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { getProducts } from "../../api/products";
import { deleteAdminProduct } from "../../api/adminProducts";

const COUNTRIES = [
  "All Countries",
  "South Korea",
  "Japan",
  "France",
  "Canada",
  "USA",
];
const TYPES = [
  "All Types",
  "Serum",
  "Essence",
  "Sunscreen",
  "Moisturizer",
  "Treatment",
  "Cleanser",
];
const STATUSES = ["All Statuses", "Active", "Hidden"];
const PER_PAGE = 6;

// ── Status Chip ────────────────────────────────────────────
function StatusChip({ status }) {
  const isActive = status === "active";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 font-admin-label text-[10px]"
      style={{
        backgroundColor: isActive
          ? "rgba(74,107,74,0.1)"
          : "rgba(94,94,92,0.1)",
        color: isActive ? "#4a6b4a" : "#5e5e5c",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: isActive ? "#4a6b4a" : "#5e5e5c" }}
      />
      {isActive ? "Active" : "Hidden"}
    </span>
  );
}

function FilterSelect({ value, onChange, options }) {
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
        {options.map((o) => (
          <option key={o}>{o}</option>
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

// ── Main ───────────────────────────────────────────────────
function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All Countries");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Statuses");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProducts({ page: 1, limit: 200 });
        const list = Array.isArray(data) ? data : data?.data || [];
        const normalized = list.map((item) => ({
          id: item.id,
          name: item.namaProduk || item.name || "",
          subtitle: item.manfaatUtama || item.description || "",
          brand: item.brand || "-",
          country:
            item.country?.namaNegara ||
            item.country?.kodeNegara ||
            item.country ||
            "-",
          type: item.productType?.nama || item.type || "-",
          favorites: item.favorites?.length || 0,
          status: "active",
          image: item.imageUrl || item.image || null,
        }));
        setProducts(normalized);
      } catch (err) {
        setError(err?.response?.data?.error || "Gagal memuat produk.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCountry = country === "All Countries" || p.country === country;
    const matchType = type === "All Types" || p.type === type;
    const matchStatus =
      status === "All Statuses" || p.status === status.toLowerCase();
    return matchSearch && matchCountry && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    const pageIds = paginated.map((p) => p.id);
    const allSelected = pageIds.every((id) => selected.includes(id));
    setSelected(
      allSelected
        ? selected.filter((id) => !pageIds.includes(id))
        : [...new Set([...selected, ...pageIds])],
    );
  };

  const handleDelete = (product) => {
    setDeleteTarget(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError("");

    try {
      await deleteAdminProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setSelected((prev) => prev.filter((id) => id !== deleteTarget.id));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      setError(err?.response?.data?.error || "Gagal menghapus produk.");
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
        {/* Page Header */}
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
              {products.length} products in your curated collection
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 font-admin-label tracking-widest transition-opacity hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: "var(--color-admin-primary)",
              color: "var(--color-admin-on-primary)",
            }}
            onClick={() => navigate("/admin/addproduct")}
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            ADD NEW PRODUCT
          </button>
        </div>

        {error && (
          <div className="mb-4">
            <p
              className="font-admin-body-md"
              style={{ color: "var(--color-admin-error)" }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Search + Filters */}
        <div
          className="flex flex-wrap items-center gap-3 p-4 mb-0 border border-b-0"
          style={{
            backgroundColor: "var(--color-admin-surface-container-lowest)",
            borderColor: "var(--color-admin-outline-variant)",
          }}
        >
          {/* Search */}
          <div
            className="flex items-center gap-2 flex-1 min-w-[200px] border-b pb-1"
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-admin-body-md outline-none flex-1"
              style={{ color: "var(--color-admin-on-surface)" }}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <span
              className="font-admin-label text-[10px]"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              FILTER BY
            </span>
            <FilterSelect
              value={country}
              onChange={(value) => {
                setCountry(value);
                setPage(1);
              }}
              options={COUNTRIES}
            />
            <FilterSelect
              value={type}
              onChange={(value) => {
                setType(value);
                setPage(1);
              }}
              options={TYPES}
            />
            <FilterSelect
              value={status}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              options={STATUSES}
            />
          </div>
        </div>

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
            className="grid items-center px-4 py-3 border-b"
            style={{
              gridTemplateColumns:
                "40px 1fr 140px 100px 120px 100px 120px 100px",
              borderColor: "var(--color-admin-outline-variant)",
              backgroundColor: "var(--color-admin-surface-container-low)",
            }}
          >
            {/* Select All */}
            <div
              className="w-4 h-4 border flex items-center justify-center cursor-pointer"
              style={{
                borderColor: "var(--color-admin-outline-variant)",
                backgroundColor: paginated.every((p) => selected.includes(p.id))
                  ? "var(--color-admin-primary)"
                  : "transparent",
              }}
              onClick={toggleAll}
            >
              {paginated.every((p) => selected.includes(p.id)) &&
                paginated.length > 0 && (
                  <span
                    className="material-symbols-outlined text-[11px]"
                    style={{ color: "var(--color-admin-on-primary)" }}
                  >
                    check
                  </span>
                )}
            </div>
            {[
              "PRODUCT",
              "BRAND",
              "COUNTRY",
              "TYPE",
              "FAVORITES",
              "STATUS",
              "ACTIONS",
            ].map((h) => (
              <span
                key={h}
                className="font-admin-label text-[10px]"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <p
                className="font-admin-body-md"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                Memuat produk...
              </p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p
                className="font-admin-body-md"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                No products found.
              </p>
            </div>
          ) : (
            paginated.map((product, i) => (
              <div
                key={product.id}
                className="grid items-center px-4 py-3 transition-colors hover:bg-opacity-50"
                style={{
                  gridTemplateColumns:
                    "40px 1fr 140px 100px 120px 100px 120px 100px",
                  borderBottom:
                    i < paginated.length - 1
                      ? `1px solid var(--color-admin-outline-variant)`
                      : "none",
                  backgroundColor: selected.includes(product.id)
                    ? "var(--color-admin-surface-container-low)"
                    : "transparent",
                }}
              >
                {/* Checkbox */}
                <div
                  className="w-4 h-4 border flex items-center justify-center cursor-pointer"
                  style={{
                    borderColor: "var(--color-admin-outline-variant)",
                    backgroundColor: selected.includes(product.id)
                      ? "var(--color-admin-primary)"
                      : "transparent",
                  }}
                  onClick={() => toggleSelect(product.id)}
                >
                  {selected.includes(product.id) && (
                    <span
                      className="material-symbols-outlined text-[11px]"
                      style={{ color: "var(--color-admin-on-primary)" }}
                    >
                      check
                    </span>
                  )}
                </div>

                {/* Product */}
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <div
                    className="w-10 h-10 flex-shrink-0 overflow-hidden"
                    style={{
                      backgroundColor: "var(--color-admin-surface-container)",
                      border: "1px solid var(--color-admin-outline-variant)",
                    }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ color: "var(--color-admin-outline)" }}
                        >
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
                      {product.name}
                    </p>
                    <p
                      className="font-admin-data text-[11px] truncate"
                      style={{ color: "var(--color-admin-on-surface-variant)" }}
                    >
                      {product.subtitle}
                    </p>
                  </div>
                </div>

                {/* Brand */}
                <span
                  className="font-admin-body-md"
                  style={{ color: "var(--color-admin-on-surface)" }}
                >
                  {product.brand}
                </span>

                {/* Country */}
                <span
                  className="font-admin-data text-[11px] px-2 py-1 border inline-block"
                  style={{
                    borderColor: "var(--color-admin-outline-variant)",
                    color: "var(--color-admin-on-surface-variant)",
                  }}
                >
                  {product.country}
                </span>

                {/* Type */}
                <span
                  className="font-admin-body-md"
                  style={{ color: "var(--color-admin-on-surface)" }}
                >
                  {product.type}
                </span>

                {/* Favorites */}
                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ color: "var(--color-admin-primary-container)" }}
                  >
                    favorite
                  </span>
                  <span
                    className="font-admin-data"
                    style={{ color: "var(--color-admin-on-surface)" }}
                  >
                    {product.favorites.toLocaleString()}
                  </span>
                </div>

                {/* Status */}
                <StatusChip status={product.status} />

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    className="material-symbols-outlined text-[18px] cursor-pointer transition-colors hover:opacity-70"
                    style={{ color: "var(--color-admin-on-surface-variant)" }}
                  >
                    visibility
                  </button>
                  <button
                    className="material-symbols-outlined text-[18px] cursor-pointer transition-colors hover:opacity-70"
                    style={{ color: "var(--color-admin-on-surface-variant)" }}
                  >
                    edit
                  </button>
                  <button
                    className="material-symbols-outlined text-[18px] cursor-pointer transition-colors hover:opacity-70"
                    style={{ color: "var(--color-admin-error)" }}
                    onClick={() => handleDelete(product)}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Pagination */}
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
              Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
              {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}{" "}
              products
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center border cursor-pointer disabled:opacity-30 transition-colors"
                style={{
                  borderColor: "var(--color-admin-outline-variant)",
                  color: "var(--color-admin-on-surface-variant)",
                }}
              >
                <span className="material-symbols-outlined text-[16px]">
                  chevron_left
                </span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-8 h-8 flex items-center justify-center border font-admin-data text-[12px] cursor-pointer transition-colors"
                  style={{
                    borderColor:
                      page === p
                        ? "var(--color-admin-primary)"
                        : "var(--color-admin-outline-variant)",
                    backgroundColor:
                      page === p ? "var(--color-admin-primary)" : "transparent",
                    color:
                      page === p
                        ? "var(--color-admin-on-primary)"
                        : "var(--color-admin-on-surface-variant)",
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center border cursor-pointer disabled:opacity-30 transition-colors"
                style={{
                  borderColor: "var(--color-admin-outline-variant)",
                  color: "var(--color-admin-on-surface-variant)",
                }}
              >
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          />
          <div
            className="relative w-[480px] border p-12 flex flex-col items-center text-center z-10"
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
              Delete this product?
            </h2>
            <p
              className="font-admin-body-md mb-6 max-w-[320px]"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              You're about to permanently remove '{deleteTarget.name}' from the
              collection. This action cannot be undone, and{" "}
              {deleteTarget.favorites.toLocaleString()} users have saved this to
              their favorites.
            </p>

            {/* Info Card */}
            <div
              className="w-full p-3 mb-6"
              style={{
                backgroundColor: "var(--color-admin-surface-container-low)",
                borderLeft: "2px solid #8B3A3A",
              }}
            >
              <p
                className="font-admin-body-md text-[12px] italic"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                Consider hiding this product instead to preserve user favorites.
              </p>
            </div>

            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-11 border font-admin-label tracking-widest cursor-pointer transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--color-admin-on-surface)",
                  color: "var(--color-admin-on-surface)",
                }}
              >
                CANCEL
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 h-11 font-admin-label tracking-widest cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#8B3A3A", color: "#ffffff" }}
              >
                {isDeleting ? "DELETING..." : "DELETE PERMANENTLY"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
