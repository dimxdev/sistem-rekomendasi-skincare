import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import AdminSidebar from "../../components/AdminSidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

// ── Mock Data ──────────────────────────────────────────────
const stats = [
  { label: "TOTAL PRODUCTS", value: "248", trend: "+12%", up: true },
  { label: "TOTAL USERS", value: "1,847", trend: "+5%", up: true },
  { label: "TOTAL FAVORITES", value: "5,621", trend: "+8%", up: true },
  { label: "ACTIVE TODAY", value: "127", trend: "-2%", up: false },
];

const mostLiked = [
  { rank: "01", name: "Revive Eye Serum : Ginseng + Retinal", brand: "Beauty of Joseon", likes: 1245, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&q=80" },
  { rank: "02", name: "Advanced Snail 96 Mucin Power Essence", brand: "COSRX", likes: 982, image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=80&q=80" },
  { rank: "03", name: "Facial Treatment Essence", brand: "SK-II", likes: 856, image: "https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=80&q=80" },
  { rank: "04", name: "Watermelon Glow Niacinamide Dew Drops", brand: "Glow Recipe", likes: 712, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=80&q=80" },
  { rank: "05", name: "Toleriane Double Repair Face Moisturizer", brand: "La Roche-Posay", likes: 645, image: null },
];

const recentUsers = [
  { initials: "AD", name: "Adelia Doe", joined: "Joined Today, 10:42 AM" },
  { initials: "MR", name: "Marcus Rossi", joined: "Joined Today, 09:15 AM" },
  { initials: "EL", name: "Elena Lin", joined: "Joined Yesterday" },
  { initials: "SJ", name: "Samuel Jones", joined: "Joined Yesterday" },
  { initials: "VK", name: "Valerie King", joined: "Joined Oct 22" },
];

const chartData7D = [
  { date: "Oct 01", users: 320 },
  { date: "Oct 02", users: 380 },
  { date: "Oct 03", users: 410 },
  { date: "Oct 04", users: 390 },
  { date: "Oct 05", users: 450 },
  { date: "Oct 06", users: 500 },
  { date: "Oct 07", users: 520 },
];

const chartData30D = [
  { date: "Oct 01", users: 320 },
  { date: "Oct 07", users: 520 },
  { date: "Oct 14", users: 780 },
  { date: "Oct 21", users: 1100 },
  { date: "Oct 28", users: 1847 },
];

const chartData90D = [
  { date: "Aug 01", users: 200 },
  { date: "Aug 15", users: 400 },
  { date: "Sep 01", users: 600 },
  { date: "Sep 15", users: 900 },
  { date: "Oct 01", users: 1200 },
  { date: "Oct 15", users: 1600 },
  { date: "Oct 28", users: 1847 },
];

const chartMap = { "7D": chartData7D, "30D": chartData30D, "90D": chartData90D };


const buildChartData = (source) => ({
  labels: source.map((item) => item.date),
  datasets: [
    {
      label: "Users",
      data: source.map((item) => item.users),
      borderColor: "#B8956A",
      backgroundColor: "rgba(184, 149, 106, 0.18)",
      fill: true,
      tension: 0.35,
      pointRadius: 0,
      borderWidth: 2,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#FAF8F5",
      borderColor: "#E6E0D9",
      borderWidth: 1,
      titleColor: "#6B6157",
      bodyColor: "#B8956A",
      padding: 10,
      displayColors: false,
      callbacks: {
        label: (context) => `${context.raw.toLocaleString()} users`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#8C8176",
        font: { size: 10, family: "var(--font-admin-body)" },
      },
    },
    y: {
      grid: { color: "#EFE9E2" },
      ticks: {
        color: "#8C8176",
        font: { size: 10, family: "var(--font-admin-body)" },
      },
    },
  },
};

// ── Main Dashboard ─────────────────────────────────────────
function AdminDashboard() {
  const [chartRange, setChartRange] = useState("30D");

  return (
    <div
      className="admin min-h-screen"
      style={{ backgroundColor: "var(--color-admin-background)" }}
    >
      <AdminSidebar activePage="overview" />

      {/* Main Content */}
      <main
        className="min-h-screen"
        style={{ marginLeft: "var(--admin-sidebar-width)", padding: "40px" }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1 flex items-center gap-3 border-b max-w-xs" style={{ borderColor: "var(--color-admin-outline-variant)" }}>
            <span className="material-symbols-outlined text-[18px]" style={{ color: "var(--color-admin-on-surface-variant)" }}>
              search
            </span>
            <input
              type="text"
              placeholder="SEARCH"
              className="bg-transparent font-admin-label tracking-widest py-2 outline-none w-full placeholder:opacity-40"
              style={{ color: "var(--color-admin-on-surface)" }}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-[22px] cursor-pointer" style={{ color: "var(--color-admin-on-surface-variant)" }}>
              notifications
            </button>
            <button className="material-symbols-outlined text-[22px] cursor-pointer" style={{ color: "var(--color-admin-on-surface-variant)" }}>
              mail
            </button>
            <button className="material-symbols-outlined text-[22px] cursor-pointer" style={{ color: "var(--color-admin-on-surface-variant)" }}>
              account_circle
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-admin-display-lg" style={{ color: "var(--color-admin-on-surface)" }}>
              Overview
            </h1>
            <p className="font-admin-body-md mt-1" style={{ color: "var(--color-admin-on-surface-variant)" }}>
              Welcome back, Adelia. Here is today's summary.
            </p>
          </div>
          <span className="font-admin-label" style={{ color: "var(--color-admin-on-surface-variant)" }}>
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase()}
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 border"
              style={{
                backgroundColor: "var(--color-admin-surface-container-lowest)",
                borderColor: "var(--color-admin-outline-variant)",
              }}
            >
              <p className="font-admin-label mb-4" style={{ color: "var(--color-admin-on-surface-variant)" }}>
                {stat.label}
              </p>
              <div className="flex items-end gap-3">
                <span className="font-admin-display-lg" style={{ color: "var(--color-admin-on-surface)" }}>
                  {stat.value}
                </span>
                <span
                  className="font-admin-data mb-1 flex items-center gap-0.5"
                  style={{ color: stat.up ? "#4a6b4a" : "#8B3A3A" }}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {stat.up ? "arrow_upward" : "arrow_downward"}
                  </span>
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Most Liked Products */}
          <div
            className="lg:col-span-2 border"
            style={{
              backgroundColor: "var(--color-admin-surface-container-lowest)",
              borderColor: "var(--color-admin-outline-variant)",
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: "var(--color-admin-outline-variant)" }}
            >
              <h2 className="font-admin-headline-md" style={{ color: "var(--color-admin-on-surface)" }}>
                Most Liked Products
              </h2>
              <button
                className="font-admin-label transition-colors cursor-pointer hover:underline"
                style={{ color: "var(--color-admin-primary)" }}
              >
                VIEW ALL
              </button>
            </div>

            {/* Table Header */}
            <div
              className="grid px-6 py-2 border-b"
              style={{
                gridTemplateColumns: "48px 1fr 80px",
                borderColor: "var(--color-admin-outline-variant)",
                backgroundColor: "var(--color-admin-surface-container-low)",
              }}
            >
              {["RANK", "PRODUCT", "LIKES"].map((h) => (
                <span key={h} className="font-admin-label text-[10px]" style={{ color: "var(--color-admin-on-surface-variant)" }}>
                  {h}
                </span>
              ))}
            </div>

            {mostLiked.map((item, i) => (
              <div
                key={item.rank}
                className="grid items-center px-6 py-3 transition-colors"
                style={{
                  gridTemplateColumns: "48px 1fr 80px",
                  borderBottom: i < mostLiked.length - 1 ? `1px solid var(--color-admin-outline-variant)` : "none",
                }}
              >
                <span className="font-admin-data" style={{ color: "var(--color-admin-on-surface-variant)" }}>
                  {item.rank}
                </span>
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: "var(--color-admin-surface-container)", border: "1px solid var(--color-admin-outline-variant)" }}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[18px] m-auto flex items-center justify-center h-full" style={{ color: "var(--color-admin-outline)" }}>
                        image
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-admin-body-md truncate" style={{ color: "var(--color-admin-on-surface)" }}>
                      {item.name}
                    </p>
                    <p className="font-admin-data text-[11px]" style={{ color: "var(--color-admin-on-surface-variant)" }}>
                      {item.brand}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ color: "var(--color-admin-primary-container)" }}>
                    favorite
                  </span>
                  <span className="font-admin-data" style={{ color: "var(--color-admin-on-surface)" }}>
                    {item.likes.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Users */}
          <div
            className="border"
            style={{
              backgroundColor: "var(--color-admin-surface-container-lowest)",
              borderColor: "var(--color-admin-outline-variant)",
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: "var(--color-admin-outline-variant)" }}
            >
              <h2 className="font-admin-headline-md" style={{ color: "var(--color-admin-on-surface)" }}>
                Recent Users
              </h2>
              <button
                className="font-admin-label transition-colors cursor-pointer hover:underline"
                style={{ color: "var(--color-admin-primary)" }}
              >
                MANAGE
              </button>
            </div>

            <div className="flex flex-col">
              {recentUsers.map((user, i) => (
                <div
                  key={user.name}
                  className="flex items-center gap-3 px-6 py-4"
                  style={{
                    borderBottom: i < recentUsers.length - 1 ? `1px solid var(--color-admin-outline-variant)` : "none",
                  }}
                >
                  <div
                    className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: "var(--color-admin-surface-container)",
                      border: "1px solid var(--color-admin-outline-variant)",
                    }}
                  >
                    <span className="font-admin-label text-[10px]" style={{ color: "var(--color-admin-primary)" }}>
                      {user.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-admin-body-md" style={{ color: "var(--color-admin-on-surface)" }}>
                      {user.name}
                    </p>
                    <p className="font-admin-data text-[11px]" style={{ color: "var(--color-admin-on-surface-variant)" }}>
                      {user.joined}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Growth Chart */}
        <div
          className="border p-6"
          style={{
            backgroundColor: "var(--color-admin-surface-container-lowest)",
            borderColor: "var(--color-admin-outline-variant)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-admin-headline-md" style={{ color: "var(--color-admin-on-surface)" }}>
              User Growth
            </h2>
            <div className="flex gap-1">
              {["7D", "30D", "90D"].map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className="px-3 py-1.5 font-admin-label text-[10px] transition-colors cursor-pointer"
                  style={{
                    backgroundColor: chartRange === range ? "var(--color-admin-primary)" : "transparent",
                    color: chartRange === range ? "var(--color-admin-on-primary)" : "var(--color-admin-on-surface-variant)",
                    border: `1px solid ${chartRange === range ? "var(--color-admin-primary)" : "var(--color-admin-outline-variant)"}`,
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-[260px]">
            <Line data={buildChartData(chartMap[chartRange])} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;