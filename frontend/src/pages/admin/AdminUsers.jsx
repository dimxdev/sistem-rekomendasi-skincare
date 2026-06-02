import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { getAllUsers, updateUser, deleteUser } from "../../api/adminUsers";

const STATUSES = ["All Statuses", "User", "Admin"];
const PER_PAGE = 8;

// --- Komponen Bantuan ---
function StatusChip({ role }) {
  const isAdmin = role === "admin";

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 font-admin-label text-[10px]"
      style={{
        backgroundColor: isAdmin
          ? "rgba(139,58,58,0.1)"
          : "rgba(74,107,74,0.1)",
        color: isAdmin ? "#8B3A3A" : "#4a6b4a",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: isAdmin ? "#8B3A3A" : "#4a6b4a" }}
      />
      {isAdmin ? "ADMIN" : "USER"}
    </span>
  );
}

function Avatar({ user, size = 36 }) {
  // Buat inisial dari nama lengkap
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className="flex items-center justify-center shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--color-admin-surface-container)",
        border: "1px solid var(--color-admin-outline-variant)",
      }}
    >
      <span
        className="font-admin-label text-[11px]"
        style={{ color: "var(--color-admin-primary)" }}
      >
        {getInitials(user.namaLengkap)}
      </span>
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <div
      className="relative flex items-center gap-1 px-3 py-2 border cursor-pointer min-w-35"
      style={{
        borderColor: "var(--color-admin-outline-variant)",
        backgroundColor: "var(--color-admin-surface-container-lowest)",
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent font-admin-data text-label-caps outline-none cursor-pointer pr-4 w-full"
        style={{ color: "var(--color-admin-on-surface)" }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span
        className="material-symbols-outlined text-button absolute right-2 pointer-events-none"
        style={{ color: "var(--color-admin-on-surface-variant)" }}
      >
        keyboard_arrow_down
      </span>
    </div>
  );
}

// --- Komponen Modal Edit ---
function EditUserModal({ user, onClose, onSave, onDelete }) {
  const [namaLengkap, setNamaLengkap] = useState(user.namaLengkap || "");
  const [email, setEmail] = useState(user.email || "");
  const [focusedField, setFocusedField] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSaveClick = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const updatedData = { namaLengkap, email };
      // Panggil API Update
      const res = await updateUser(user.id, updatedData);
      onSave(res.data); // Update state di parent
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    try {
      setIsLoading(true);
      await deleteUser(user.id);
      onDelete(user.id); // Hapus dari state di parent
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Gagal menghapus akun");
      setIsLoading(false);
    }
  };

  // Format tanggal Registrasi
  const joinDate = new Date(user.tanggalRegistrasi).toLocaleDateString(
    "id-ID",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative w-full max-w-140 border z-10 overflow-y-auto max-h-[90vh]"
        style={{
          backgroundColor: "var(--color-admin-surface-container-lowest)",
          borderColor: "var(--color-admin-outline-variant)",
        }}
      >
        <div
          className="px-8 pt-8 pb-6 border-b"
          style={{ borderColor: "var(--color-admin-outline-variant)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="font-admin-label text-[10px] mb-1"
                style={{ color: "var(--color-admin-primary)" }}
              >
                EDIT MEMBER
              </p>
              <h2
                className="font-admin-headline-md"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                User Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="material-symbols-outlined text-[22px] cursor-pointer transition-colors mt-1"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              close
            </button>
          </div>
        </div>

        <div className="px-8 py-6 flex flex-col gap-6">
          {errorMsg && (
            <div className="p-3 mb-2 bg-red-100 text-red-700 text-sm border border-red-300">
              {errorMsg}
            </div>
          )}

          <div
            className="flex items-center gap-4 p-4 border"
            style={{
              backgroundColor: "var(--color-admin-surface-container-low)",
              borderColor: "var(--color-admin-outline-variant)",
            }}
          >
            <Avatar user={user} size={56} />
            <div>
              <p
                className="font-admin-body-lg font-medium"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                {user.namaLengkap}
              </p>
              <p
                className="font-admin-body-md"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                {user.email}
              </p>
              <p
                className="font-admin-data text-[11px] mt-0.5"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                Member since {joinDate} · ID #{user.id.substring(0, 8)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="font-admin-label text-[10px]"
              style={{ color: "var(--color-admin-primary)" }}
            >
              FULL NAME
            </label>
            <div
              className="transition-colors duration-200"
              style={{
                borderBottom: `1px solid ${focusedField === "name" ? "var(--color-admin-primary)" : "var(--color-admin-outline-variant)"}`,
              }}
            >
              <input
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent font-admin-body-md outline-none py-2"
                style={{ color: "var(--color-admin-on-surface)" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="font-admin-label text-[10px]"
              style={{ color: "var(--color-admin-primary)" }}
            >
              EMAIL ADDRESS
            </label>
            <div
              className="transition-colors duration-200"
              style={{
                borderBottom: `1px solid ${focusedField === "email" ? "var(--color-admin-primary)" : "var(--color-admin-outline-variant)"}`,
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent font-admin-body-md outline-none py-2"
                style={{ color: "var(--color-admin-on-surface)" }}
              />
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between px-8 py-5 border-t"
          style={{ borderColor: "var(--color-admin-outline-variant)" }}
        >
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 font-admin-label text-[10px] tracking-widest cursor-pointer transition-opacity hover:opacity-70"
            style={{ color: "#8B3A3A" }}
          >
            <span className="material-symbols-outlined text-body-md">
              delete
            </span>
            DELETE USER
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border font-admin-label tracking-widest cursor-pointer transition-colors hover:opacity-80"
              style={{
                borderColor: "var(--color-admin-on-surface)",
                color: "var(--color-admin-on-surface)",
              }}
            >
              CANCEL
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isLoading}
              className="px-6 py-2.5 font-admin-label tracking-widest cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-admin-on-surface)",
                color: "var(--color-admin-surface)",
              }}
            >
              {isLoading ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <div
              className="w-90 border p-8 flex flex-col items-center text-center"
              style={{
                backgroundColor: "var(--color-admin-surface-container-lowest)",
                borderColor: "var(--color-admin-outline-variant)",
              }}
            >
              <h3
                className="font-admin-headline-md mb-2"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                Delete this user?
              </h3>
              <p
                className="font-admin-body-md text-[13px] mb-5"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                This will permanently remove {user.namaLengkap}'s account.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 h-10 border font-admin-label text-[10px] tracking-widest cursor-pointer"
                  style={{
                    borderColor: "var(--color-admin-on-surface)",
                    color: "var(--color-admin-on-surface)",
                  }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleDeleteClick}
                  disabled={isLoading}
                  className="flex-1 h-10 font-admin-label text-[10px] tracking-widest cursor-pointer"
                  style={{ backgroundColor: "#8B3A3A", color: "#ffffff" }}
                >
                  {isLoading ? "DELETING..." : "DELETE"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Komponen Utama Halaman ---
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data dari API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await getAllUsers();
        if (res.success) {
          setUsers(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((user) => {
    const matchSearch =
      (user.namaLengkap || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All Statuses" ||
      user.role === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSave = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
    setEditUser(null);
  };

  const handleDelete = (deletedId) => {
    setUsers((prev) => prev.filter((u) => u.id !== deletedId));
    setEditUser(null);
  };

  return (
    <div
      className="admin min-h-screen"
      style={{ backgroundColor: "var(--color-admin-background)" }}
    >
      <AdminSidebar activePage="users" />

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
              USER MANAGEMENT
            </p>
            <h1
              className="font-admin-display-lg"
              style={{ color: "var(--color-admin-on-surface)" }}
            >
              Users
            </h1>
            <p
              className="font-admin-body-md mt-1"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              {users.length.toLocaleString()} registered members in your
              community
            </p>
          </div>
        </div>

        <div
          className="mb-6 h-px"
          style={{ backgroundColor: "var(--color-admin-outline-variant)" }}
        />

        <div className="flex flex-wrap items-end gap-6 mb-6">
          <div className="flex flex-col gap-1.5 flex-1 min-w-50">
            <label
              className="font-admin-label text-[10px]"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              SEARCH
            </label>
            <div
              className="flex items-center gap-2 border-b"
              style={{ borderColor: "var(--color-admin-outline-variant)" }}
            >
              <span
                className="material-symbols-outlined text-body-md"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent font-admin-body-md outline-none py-2 flex-1"
                style={{ color: "var(--color-admin-on-surface)" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="font-admin-label text-[10px]"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              ROLE / STATUS
            </label>
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUSES}
            />
          </div>
        </div>

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
              gridTemplateColumns: "40px 80px 1fr 200px 140px 100px",
              borderColor: "var(--color-admin-outline-variant)",
              backgroundColor: "var(--color-admin-surface-container-low)",
            }}
          >
            <div className="w-4 h-4 border border-transparent"></div>
            {["", "USER", "EMAIL", "JOINED", "ROLE", "ACTIONS"].map(
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
                Loading data users...
              </p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="font-admin-body-md text-gray-500">
                No users found.
              </p>
            </div>
          ) : (
            paginated.map((user, index) => (
              <div
                key={user.id}
                className="grid items-center px-4 py-3 transition-colors"
                style={{
                  gridTemplateColumns: "40px 80px 1fr 200px 140px 100px",
                  borderBottom:
                    index < paginated.length - 1
                      ? "1px solid var(--color-admin-outline-variant)"
                      : "none",
                }}
              >
                <div className="w-4 h-4"></div>

                <Avatar user={user} size={36} />

                <div className="min-w-0 pr-4">
                  <p
                    className="font-admin-body-md truncate"
                    style={{ color: "var(--color-admin-on-surface)" }}
                  >
                    {user.namaLengkap}
                  </p>
                  <p
                    className="font-admin-data text-[11px]"
                    style={{ color: "var(--color-admin-on-surface-variant)" }}
                  >
                    User ID #{user.id.substring(0, 8)}
                  </p>
                </div>

                <span
                  className="font-admin-body-md truncate"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  {user.email}
                </span>

                <div>
                  <p
                    className="font-admin-body-md"
                    style={{ color: "var(--color-admin-on-surface)" }}
                  >
                    {new Date(user.tanggalRegistrasi).toLocaleDateString()}
                  </p>
                </div>

                <StatusChip role={user.role} />

                <div className="flex items-center gap-2">
                  <button
                    className="material-symbols-outlined text-body-lg cursor-pointer hover:opacity-70"
                    style={{ color: "var(--color-admin-on-surface-variant)" }}
                    onClick={() => setEditUser(user)}
                    type="button"
                  >
                    edit
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
              className="font-admin-data text-label-caps"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
              {Math.min(page * PER_PAGE, filtered.length)} of{" "}
              {filtered.length.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (currentPage) => (
                  <button
                    key={currentPage}
                    onClick={() => setPage(currentPage)}
                    className="w-8 h-8 flex items-center justify-center border font-admin-data text-label-caps cursor-pointer"
                    style={{
                      borderColor:
                        page === currentPage
                          ? "var(--color-admin-primary)"
                          : "var(--color-admin-outline-variant)",
                      backgroundColor:
                        page === currentPage
                          ? "var(--color-admin-primary)"
                          : "transparent",
                      color:
                        page === currentPage
                          ? "var(--color-admin-on-primary)"
                          : "var(--color-admin-on-surface-variant)",
                    }}
                  >
                    {currentPage}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </main>

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
