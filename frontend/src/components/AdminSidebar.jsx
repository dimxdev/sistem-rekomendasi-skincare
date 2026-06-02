import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const navItems = [
  {
    label: "Overview",
    icon: "dashboard",
    key: "overview",
    path: "/admin/dashboard",
  },
  {
    label: "Products",
    icon: "inventory_2",
    key: "products",
    path: "/admin/products",
  },
  { label: "Users", icon: "group", key: "users", path: "/admin/users" },
  {
    label: "Countries",
    icon: "public",
    key: "countries",
    path: "/admin/countries",
  },
  // === MENU BARU ===
  {
    label: "Product Types",
    icon: "category",
    key: "product-types",
    path: "/admin/product-types",
  },
  {
    label: "Skin Types",
    icon: "face",
    key: "skin-types",
    path: "/admin/skin-types",
  },
  {
    label: "Skin Concerns",
    icon: "healing",
    key: "concerns",
    path: "/admin/concerns",
  },
];
const getInitials = (value) => {
  if (!value) return "AD";
  return value.trim().slice(0, 2).toUpperCase();
};

function AdminSidebar({ activePage }) {
  const navigate = useNavigate();
  const admin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("admin") || "null");
    } catch {
      return null;
    }
  }, []);

  const username = admin?.username || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col z-30"
      style={{
        width: "var(--admin-sidebar-width)",
        backgroundColor: "var(--color-admin-surface-container-low)",
        borderRight: "1px solid var(--color-admin-outline-variant)",
      }}
    >
      <div
        className="p-8 border-b"
        style={{ borderColor: "var(--color-admin-outline-variant)" }}
      >
        <p
          className="font-admin-label mb-1"
          style={{ color: "var(--color-admin-primary)" }}
        >
          ADMIN
        </p>
        <h1
          className="font-admin-headline-md tracking-[0.15em] uppercase"
          style={{ color: "var(--color-admin-on-surface)" }}
        >
          LUMIERE
        </h1>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = activePage === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 px-8 py-3 w-full text-left transition-colors cursor-pointer"
              style={{
                borderLeft: isActive
                  ? "2px solid var(--color-admin-primary)"
                  : "2px solid transparent",
                backgroundColor: isActive
                  ? "var(--color-admin-surface-container)"
                  : "transparent",
                color: isActive
                  ? "var(--color-admin-primary)"
                  : "var(--color-admin-on-surface-variant)",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span className="font-admin-body-md">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div
        className="p-6 border-t flex items-center gap-3"
        style={{ borderColor: "var(--color-admin-outline-variant)" }}
      >
        <div
          className="w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: "var(--color-admin-surface-container)",
            border: "1px solid var(--color-admin-outline-variant)",
          }}
        >
          <span
            className="font-admin-label text-[11px]"
            style={{ color: "var(--color-admin-primary)" }}
          >
            {getInitials(username)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-admin-body-md truncate"
            style={{ color: "var(--color-admin-on-surface)" }}
          >
            {username}
          </p>
          <p
            className="font-admin-data text-[11px] truncate"
            style={{ color: "var(--color-admin-on-surface-variant)" }}
          >
            Admin
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="material-symbols-outlined text-[18px] cursor-pointer"
          style={{ color: "var(--color-admin-on-surface-variant)" }}
        >
          logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
