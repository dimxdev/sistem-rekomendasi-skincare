import { useMemo, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

const allUsers = [
  {
    id: 1024,
    initials: "ES",
    name: "Eleanor Sterling",
    email: "eleanor.s@example.com",
    joined: "Mar 12, 2026",
    joinedRelative: "2 months ago",
    favorites: 24,
    status: "active",
    image: null,
  },
  {
    id: 1025,
    initials: "JM",
    name: "Julian Mercer",
    email: "j.mercer@corp.net",
    joined: "Mar 10, 2026",
    joinedRelative: "2 months ago",
    favorites: 8,
    status: "active",
    image: null,
  },
  {
    id: 1026,
    initials: "VW",
    name: "Victoria Wells",
    email: "victoria.w@example.com",
    joined: "Mar 05, 2026",
    joinedRelative: "2 months ago",
    favorites: 42,
    status: "banned",
    image: null,
  },
  {
    id: 1027,
    initials: "CH",
    name: "Clara Hayes",
    email: "chayes.design@studio.co",
    joined: "Feb 28, 2026",
    joinedRelative: "3 months ago",
    favorites: 12,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  },
  {
    id: 1028,
    initials: "MR",
    name: "Marcus Rossi",
    email: "m.rossi@gmail.com",
    joined: "Feb 20, 2026",
    joinedRelative: "3 months ago",
    favorites: 31,
    status: "active",
    image: null,
  },
  {
    id: 1029,
    initials: "AL",
    name: "Adelia Lin",
    email: "adelia.lin@studio.io",
    joined: "Feb 15, 2026",
    joinedRelative: "3 months ago",
    favorites: 57,
    status: "active",
    image: null,
  },
  {
    id: 1030,
    initials: "SK",
    name: "Samuel King",
    email: "s.king@example.com",
    joined: "Jan 30, 2026",
    joinedRelative: "4 months ago",
    favorites: 5,
    status: "banned",
    image: null,
  },
  {
    id: 1031,
    initials: "NP",
    name: "Nina Park",
    email: "nina.park@design.co",
    joined: "Jan 22, 2026",
    joinedRelative: "4 months ago",
    favorites: 19,
    status: "active",
    image: null,
  },
  {
    id: 1032,
    initials: "TW",
    name: "Thomas Webb",
    email: "t.webb@corp.net",
    joined: "Jan 10, 2026",
    joinedRelative: "4 months ago",
    favorites: 3,
    status: "active",
    image: null,
  },
  {
    id: 1033,
    initials: "RL",
    name: "Rachel Lowe",
    email: "r.lowe@example.com",
    joined: "Jan 05, 2026",
    joinedRelative: "5 months ago",
    favorites: 44,
    status: "active",
    image: null,
  },
];

const STATUSES = ["All Statuses", "Active", "Banned"];
const PER_PAGE = 8;

function StatusChip({ status }) {
  const isActive = status === "active";

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 font-admin-label text-[10px]"
      style={{
        backgroundColor: isActive
          ? "rgba(74,107,74,0.1)"
          : "rgba(139,58,58,0.1)",
        color: isActive ? "#4a6b4a" : "#8B3A3A",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: isActive ? "#4a6b4a" : "#8B3A3A" }}
      />
      {isActive ? "ACTIVE" : "BANNED"}
    </span>
  );
}

function Avatar({ user, size = 36 }) {
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
      {user.image ? (
        <img
          src={user.image}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className="font-admin-label text-[11px]"
          style={{ color: "var(--color-admin-primary)" }}
        >
          {user.initials}
        </span>
      )}
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
          <option key={option}>{option}</option>
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

function EditUserModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [status, setStatus] = useState(user.status);
  const [focusedField, setFocusedField] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
          <div
            className="flex items-center gap-4 p-4 border"
            style={{
              backgroundColor: "var(--color-admin-surface-container-low)",
              borderColor: "var(--color-admin-outline-variant)",
            }}
          >
            <div
              className="w-14 h-14 flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "var(--color-admin-surface-container)",
                border: "1px solid var(--color-admin-outline-variant)",
              }}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="font-admin-headline-md text-body-lg"
                  style={{ color: "var(--color-admin-primary)" }}
                >
                  {user.initials}
                </span>
              )}
            </div>
            <div>
              <p
                className="font-admin-body-lg font-medium"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                {user.name}
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
                Member since {user.joined} · ID #{user.id}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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

          <div className="flex flex-col gap-3">
            <label
              className="font-admin-label text-[10px]"
              style={{ color: "var(--color-admin-primary)" }}
            >
              ACCOUNT STATUS
            </label>
            {["active", "banned"].map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer"
                  style={{
                    borderColor:
                      status === item
                        ? "var(--color-admin-primary)"
                        : "var(--color-admin-outline-variant)",
                  }}
                  onClick={() => setStatus(item)}
                >
                  {status === item && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--color-admin-primary)" }}
                    />
                  )}
                </div>
                <span
                  className="font-admin-body-md capitalize"
                  style={{
                    color:
                      status === item
                        ? "var(--color-admin-on-surface)"
                        : "var(--color-admin-on-surface-variant)",
                  }}
                >
                  {item}
                </span>
              </label>
            ))}
          </div>

          <div
            className="grid grid-cols-3 border-l-2 py-4 px-5"
            style={{
              borderLeftColor: "var(--color-admin-primary-container)",
              backgroundColor: "var(--color-admin-surface-container-low)",
            }}
          >
            {[
              { value: String(user.favorites), label: "FAVORITES" },
              { value: "47", label: "DAYS ACTIVE" },
              { value: user.joinedRelative, label: "JOINED" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="font-admin-display-lg text-[28px]"
                  style={{ color: "var(--color-admin-on-surface)" }}
                >
                  {stat.value}
                </p>
                <p
                  className="font-admin-label text-[9px] mt-0.5"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
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
              onClick={() => onSave({ ...user, name, email, status })}
              className="px-6 py-2.5 font-admin-label tracking-widest cursor-pointer transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--color-admin-on-surface)",
                color: "var(--color-admin-surface)",
              }}
            >
              SAVE CHANGES
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
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="mb-4"
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
                This will permanently remove {user.name}'s account and all their
                data.
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
                  onClick={onClose}
                  className="flex-1 h-10 font-admin-label text-[10px] tracking-widest cursor-pointer"
                  style={{ backgroundColor: "#8B3A3A", color: "#ffffff" }}
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState(allUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState(null);

  const activeCount = useMemo(
    () => users.filter((user) => user.status === "active").length,
    [users],
  );
  const bannedCount = useMemo(
    () => users.filter((user) => user.status === "banned").length,
    [users],
  );

  const filtered = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All Statuses" ||
      user.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    const pageIds = paginated.map((user) => user.id);
    const allSelected = pageIds.every((id) => selected.includes(id));
    setSelected(
      allSelected
        ? selected.filter((id) => !pageIds.includes(id))
        : [...new Set([...selected, ...pageIds])],
    );
  };

  const handleSave = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    );
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

          <div className="flex items-center gap-3 mt-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-admin-label text-[10px]"
              style={{
                backgroundColor: "rgba(74,107,74,0.1)",
                color: "#4a6b4a",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4a6b4a]" />
              {activeCount.toLocaleString()} ACTIVE
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-admin-label text-[10px]"
              style={{
                backgroundColor: "rgba(139,58,58,0.1)",
                color: "#8B3A3A",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A3A]" />
              {bannedCount} BANNED
            </span>
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
              STATUS
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
              gridTemplateColumns: "40px 80px 1fr 200px 140px 100px 100px",
              borderColor: "var(--color-admin-outline-variant)",
              backgroundColor: "var(--color-admin-surface-container-low)",
            }}
          >
            <div
              className="w-4 h-4 border flex items-center justify-center cursor-pointer"
              style={{
                borderColor: "var(--color-admin-outline-variant)",
                backgroundColor:
                  paginated.every((user) => selected.includes(user.id)) &&
                  paginated.length > 0
                    ? "var(--color-admin-primary)"
                    : "transparent",
              }}
              onClick={toggleAll}
            >
              {paginated.every((user) => selected.includes(user.id)) &&
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
              "",
              "USER",
              "EMAIL",
              "JOINED",
              "FAVORITES",
              "STATUS",
              "ACTIONS",
            ].map((header) => (
              <span
                key={header}
                className="font-admin-label text-[10px]"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                {header}
              </span>
            ))}
          </div>

          {paginated.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p
                className="font-admin-body-md"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                No users found.
              </p>
            </div>
          ) : (
            paginated.map((user, index) => (
              <div
                key={user.id}
                className="grid items-center px-4 py-3 transition-colors"
                style={{
                  gridTemplateColumns: "40px 80px 1fr 200px 140px 100px 100px",
                  borderBottom:
                    index < paginated.length - 1
                      ? "1px solid var(--color-admin-outline-variant)"
                      : "none",
                  backgroundColor: selected.includes(user.id)
                    ? "var(--color-admin-surface-container-low)"
                    : "transparent",
                }}
              >
                <div
                  className="w-4 h-4 border flex items-center justify-center cursor-pointer"
                  style={{
                    borderColor: "var(--color-admin-outline-variant)",
                    backgroundColor: selected.includes(user.id)
                      ? "var(--color-admin-primary)"
                      : "transparent",
                  }}
                  onClick={() => toggleSelect(user.id)}
                >
                  {selected.includes(user.id) && (
                    <span
                      className="material-symbols-outlined text-[11px]"
                      style={{ color: "var(--color-admin-on-primary)" }}
                    >
                      check
                    </span>
                  )}
                </div>

                <Avatar user={user} size={36} />

                <div className="min-w-0 pr-4">
                  <p
                    className="font-admin-body-md truncate"
                    style={{ color: "var(--color-admin-on-surface)" }}
                  >
                    {user.name}
                  </p>
                  <p
                    className="font-admin-data text-[11px]"
                    style={{ color: "var(--color-admin-on-surface-variant)" }}
                  >
                    User ID #{user.id}
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
                    {user.joined}
                  </p>
                  <p
                    className="font-admin-data text-[11px]"
                    style={{ color: "var(--color-admin-on-surface-variant)" }}
                  >
                    {user.joinedRelative}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-button"
                    style={{ color: "var(--color-admin-primary-container)" }}
                  >
                    favorite
                  </span>
                  <span
                    className="font-admin-data"
                    style={{ color: "var(--color-admin-on-surface)" }}
                  >
                    {user.favorites}
                  </span>
                </div>

                <StatusChip status={user.status} />

                <div className="flex items-center gap-2">
                  <button
                    className="material-symbols-outlined text-body-lg cursor-pointer transition-colors hover:opacity-70"
                    style={{ color: "var(--color-admin-on-surface-variant)" }}
                    onClick={() => setEditUser(user)}
                    type="button"
                  >
                    edit
                  </button>
                  <button
                    className="material-symbols-outlined text-body-lg cursor-pointer transition-colors hover:opacity-70"
                    style={{ color: "var(--color-admin-error)" }}
                    type="button"
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
              className="font-admin-data text-label-caps"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
              {Math.min(page * PER_PAGE, filtered.length)} of{" "}
              {filtered.length.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center border cursor-pointer disabled:opacity-30"
                style={{
                  borderColor: "var(--color-admin-outline-variant)",
                  color: "var(--color-admin-on-surface-variant)",
                }}
              >
                <span className="material-symbols-outlined text-body-md">
                  chevron_left
                </span>
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (currentPage) => (
                  <button
                    key={currentPage}
                    onClick={() => setPage(currentPage)}
                    className="w-8 h-8 flex items-center justify-center border font-admin-data text-label-caps cursor-pointer transition-colors"
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

              <button
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center border cursor-pointer disabled:opacity-30"
                style={{
                  borderColor: "var(--color-admin-outline-variant)",
                  color: "var(--color-admin-on-surface-variant)",
                }}
              >
                <span className="material-symbols-outlined text-body-md">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
