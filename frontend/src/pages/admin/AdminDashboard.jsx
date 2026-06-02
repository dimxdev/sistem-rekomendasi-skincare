import { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { getAdminDashboardSummary } from "../../api/adminDashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

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

const formatJoinedLabel = (joinedAt) => {
  if (!joinedAt) {
    return "Joined recently";
  }

  const joinedDate = new Date(joinedAt);

  if (Number.isNaN(joinedDate.getTime())) {
    return "Joined recently";
  }

  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startOfJoinedDay = new Date(
    joinedDate.getFullYear(),
    joinedDate.getMonth(),
    joinedDate.getDate(),
  );
  const diffDays = Math.round(
    (startOfToday - startOfJoinedDay) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) {
    return `Joined Today, ${joinedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  if (diffDays === 1) {
    return "Joined Yesterday";
  }

  return `Joined ${joinedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })}`;
};

const buildAssetUrl = (value) => {
  if (!value) {
    return null;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${import.meta.env.VITE_API_URL}${value}`;
};

function AdminDashboard() {
  const [chartRange, setChartRange] = useState("30D");
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAdminDashboardSummary();

        if (isMounted) {
          setDashboardData(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError?.response?.data?.error ||
              loadError.message ||
              "Gagal memuat dashboard admin.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = dashboardData?.stats ?? [];
  const mostLiked = dashboardData?.mostLikedProducts ?? [];
  const recentUsers = dashboardData?.recentUsers ?? [];
  const chartData = dashboardData?.chartData?.[chartRange] ?? [];

  const pageDate = new Date()
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <div
      className="admin min-h-screen"
      style={{ backgroundColor: "var(--color-admin-background)" }}
    >
      <AdminSidebar activePage="overview" />

      <main
        className="min-h-screen"
        style={{ marginLeft: "var(--admin-sidebar-width)", padding: "40px" }}
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1
              className="font-admin-display-lg"
              style={{ color: "var(--color-admin-on-surface)" }}
            >
              Overview
            </h1>
            <p
              className="font-admin-body-md mt-1"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              Welcome back. Here is today's summary.
            </p>
          </div>
          <span
            className="font-admin-label"
            style={{ color: "var(--color-admin-on-surface-variant)" }}
          >
            {pageDate}
          </span>
        </div>

        {isLoading ? (
          <div
            className="border p-6 mb-8"
            style={{
              backgroundColor: "var(--color-admin-surface-container-lowest)",
              borderColor: "var(--color-admin-outline-variant)",
            }}
          >
            <p
              className="font-admin-body-md"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              Memuat data dashboard...
            </p>
          </div>
        ) : error ? (
          <div
            className="border p-6 mb-8"
            style={{
              backgroundColor: "var(--color-admin-surface-container-lowest)",
              borderColor: "var(--color-admin-outline-variant)",
            }}
          >
            <p className="font-admin-body-md" style={{ color: "#8B3A3A" }}>
              {error}
            </p>
          </div>
        ) : null}

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
              <p
                className="font-admin-label mb-4"
                style={{ color: "var(--color-admin-on-surface-variant)" }}
              >
                {stat.label}
              </p>
              <div className="flex items-end gap-3">
                <span
                  className="font-admin-display-lg"
                  style={{ color: "var(--color-admin-on-surface)" }}
                >
                  {Number(stat.value).toLocaleString()}
                </span>
                <span
                  className="font-admin-data mb-1 flex items-center gap-0.5"
                  style={{ color: stat.up ? "#4a6b4a" : "#8B3A3A" }}
                >
                  <span className="material-symbols-outlined text-button">
                    {stat.up ? "arrow_upward" : "arrow_downward"}
                  </span>
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
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
              <h2
                className="font-admin-headline-md"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                Most Liked Products
              </h2>
              <Link
                to="/admin/products"
                className="font-admin-label transition-colors cursor-pointer hover:underline"
                style={{ color: "var(--color-admin-primary)" }}
              >
                VIEW ALL
              </Link>
            </div>

            <div
              className="grid px-6 py-2 border-b"
              style={{
                gridTemplateColumns: "48px 1fr 80px",
                borderColor: "var(--color-admin-outline-variant)",
                backgroundColor: "var(--color-admin-surface-container-low)",
              }}
            >
              {["RANK", "PRODUCT", "LIKES"].map((header) => (
                <span
                  key={header}
                  className="font-admin-label text-[10px]"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  {header}
                </span>
              ))}
            </div>

            {mostLiked.map((item, index) => {
              const imageUrl = buildAssetUrl(item.image);

              return (
                <div
                  key={item.rank}
                  className="grid items-center px-6 py-3 transition-colors"
                  style={{
                    gridTemplateColumns: "48px 1fr 80px",
                    borderBottom:
                      index < mostLiked.length - 1
                        ? "1px solid var(--color-admin-outline-variant)"
                        : "none",
                  }}
                >
                  <span
                    className="font-admin-data"
                    style={{ color: "var(--color-admin-on-surface-variant)" }}
                  >
                    {item.rank}
                  </span>
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 shrink-0 overflow-hidden"
                      style={{
                        backgroundColor: "var(--color-admin-surface-container)",
                        border: "1px solid var(--color-admin-outline-variant)",
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span
                          className="material-symbols-outlined text-body-lg m-auto flex items-center justify-center h-full"
                          style={{ color: "var(--color-admin-outline)" }}
                        >
                          image
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="font-admin-body-md truncate"
                        style={{ color: "var(--color-admin-on-surface)" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="font-admin-data text-[11px]"
                        style={{
                          color: "var(--color-admin-on-surface-variant)",
                        }}
                      >
                        {item.brand}
                      </p>
                    </div>
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
                      {Number(item.likes).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

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
              <h2
                className="font-admin-headline-md"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                Recent Users
              </h2>
              <Link
                to="/admin/users"
                className="font-admin-label transition-colors cursor-pointer hover:underline"
                style={{ color: "var(--color-admin-primary)" }}
              >
                MANAGE
              </Link>
            </div>

            <div className="flex flex-col">
              {recentUsers.map((user, index) => {
                const initials = user.name
                  ? user.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase())
                      .join("")
                  : "US";

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 px-6 py-4"
                    style={{
                      borderBottom:
                        index < recentUsers.length - 1
                          ? "1px solid var(--color-admin-outline-variant)"
                          : "none",
                    }}
                  >
                    <div
                      className="w-9 h-9 flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: "var(--color-admin-surface-container)",
                        border: "1px solid var(--color-admin-outline-variant)",
                      }}
                    >
                      <span
                        className="font-admin-label text-[10px]"
                        style={{ color: "var(--color-admin-primary)" }}
                      >
                        {initials}
                      </span>
                    </div>
                    <div>
                      <p
                        className="font-admin-body-md"
                        style={{ color: "var(--color-admin-on-surface)" }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="font-admin-data text-[11px]"
                        style={{
                          color: "var(--color-admin-on-surface-variant)",
                        }}
                      >
                        {formatJoinedLabel(user.joinedAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="border p-6"
          style={{
            backgroundColor: "var(--color-admin-surface-container-lowest)",
            borderColor: "var(--color-admin-outline-variant)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-admin-headline-md"
              style={{ color: "var(--color-admin-on-surface)" }}
            >
              User Growth
            </h2>
            <div className="flex gap-1">
              {["7D", "30D", "90D"].map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className="px-3 py-1.5 font-admin-label text-[10px] transition-colors cursor-pointer"
                  style={{
                    backgroundColor:
                      chartRange === range
                        ? "var(--color-admin-primary)"
                        : "transparent",
                    color:
                      chartRange === range
                        ? "var(--color-admin-on-primary)"
                        : "var(--color-admin-on-surface-variant)",
                    border: `1px solid ${
                      chartRange === range
                        ? "var(--color-admin-primary)"
                        : "var(--color-admin-outline-variant)"
                    }`,
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-65">
            <Line data={buildChartData(chartData)} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
