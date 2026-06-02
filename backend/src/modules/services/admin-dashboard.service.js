import adminDashboardRepository from "../repositories/admin-dashboard.repository.js";

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatChartLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(date);
}

function calculateTrend(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  return Math.round(((currentValue - previousValue) / previousValue) * 100);
}

function buildCumulativeSeries(users, rangeDays) {
  const today = startOfDay(new Date());
  const startDate = addDays(today, -(rangeDays - 1));
  const sortedUsers = [...users]
    .map((user) => new Date(user.tanggalRegistrasi))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => left - right);

  const series = [];
  let userIndex = 0;
  let runningTotal = sortedUsers.filter((date) => date < startDate).length;

  for (
    let currentDate = new Date(startDate);
    currentDate <= today;
    currentDate = addDays(currentDate, 1)
  ) {
    const dayEnd = addDays(currentDate, 1);

    while (userIndex < sortedUsers.length && sortedUsers[userIndex] < dayEnd) {
      runningTotal += 1;

      userIndex += 1;
    }

    series.push({
      date: formatChartLabel(currentDate),
      users: runningTotal,
    });
  }

  return series;
}

function countInRange(items, getDate, startDate, endDate) {
  return items.filter((item) => {
    const date = getDate(item);

    return date >= startDate && date < endDate;
  }).length;
}

function formatTrendValue(value) {
  return `${value >= 0 ? "+" : ""}${value}%`;
}

class AdminDashboardService {
  async getSummary() {
    const [products, users, favorites] = await Promise.all([
      adminDashboardRepository.getProductsWithFavoriteCounts(),
      adminDashboardRepository.getUsersForDashboard(),
      adminDashboardRepository.getFavoritesForDashboard(),
    ]);

    const today = startOfDay(new Date());
    const yesterday = addDays(today, -1);
    const last30DaysStart = addDays(today, -29);
    const previous30DaysStart = addDays(today, -59);

    const totalProducts = products.length;
    const totalUsers = users.length;
    const totalFavorites = favorites.length;

    const activeToday = countInRange(
      favorites,
      (favorite) => new Date(favorite.tanggalDitambahkan),
      today,
      addDays(today, 1),
    );

    const activeYesterday = countInRange(
      favorites,
      (favorite) => new Date(favorite.tanggalDitambahkan),
      yesterday,
      today,
    );

    const newProductsCurrentPeriod = countInRange(
      products,
      (product) => new Date(product.createdAt),
      last30DaysStart,
      addDays(today, 1),
    );

    const newProductsPreviousPeriod = countInRange(
      products,
      (product) => new Date(product.createdAt),
      previous30DaysStart,
      last30DaysStart,
    );

    const newUsersCurrentPeriod = countInRange(
      users,
      (user) => new Date(user.tanggalRegistrasi),
      last30DaysStart,
      addDays(today, 1),
    );

    const newUsersPreviousPeriod = countInRange(
      users,
      (user) => new Date(user.tanggalRegistrasi),
      previous30DaysStart,
      last30DaysStart,
    );

    const favoritesCurrentPeriod = countInRange(
      favorites,
      (favorite) => new Date(favorite.tanggalDitambahkan),
      last30DaysStart,
      addDays(today, 1),
    );

    const favoritesPreviousPeriod = countInRange(
      favorites,
      (favorite) => new Date(favorite.tanggalDitambahkan),
      previous30DaysStart,
      last30DaysStart,
    );

    const mostLikedProducts = [...products]
      .sort((left, right) => {
        const likeDifference = right._count.favorites - left._count.favorites;

        if (likeDifference !== 0) {
          return likeDifference;
        }

        return new Date(right.createdAt) - new Date(left.createdAt);
      })
      .slice(0, 5)
      .map((product, index) => ({
        rank: String(index + 1).padStart(2, "0"),
        name: product.namaProduk,
        brand: product.brand,
        likes: product._count.favorites,
        image: product.imageUrl,
        isActive: product.isActive,
      }));

    const recentUsers = users.slice(0, 5).map((user) => ({
      id: user.id,
      name: user.namaLengkap,
      joinedAt: user.tanggalRegistrasi,
    }));

    const productTrend = calculateTrend(
      newProductsCurrentPeriod,
      newProductsPreviousPeriod,
    );
    const userTrend = calculateTrend(
      newUsersCurrentPeriod,
      newUsersPreviousPeriod,
    );
    const favoriteTrend = calculateTrend(
      favoritesCurrentPeriod,
      favoritesPreviousPeriod,
    );
    const activeTodayTrend = calculateTrend(activeToday, activeYesterday);

    return {
      stats: [
        {
          label: "TOTAL PRODUCTS",
          value: totalProducts,
          trend: formatTrendValue(productTrend),
          up: productTrend >= 0,
        },
        {
          label: "TOTAL USERS",
          value: totalUsers,
          trend: formatTrendValue(userTrend),
          up: userTrend >= 0,
        },
        {
          label: "TOTAL FAVORITES",
          value: totalFavorites,
          trend: formatTrendValue(favoriteTrend),
          up: favoriteTrend >= 0,
        },
        {
          label: "ACTIVE TODAY",
          value: activeToday,
          trend: formatTrendValue(activeTodayTrend),
          up: activeTodayTrend >= 0,
        },
      ],
      mostLikedProducts,
      recentUsers,
      chartData: {
        "7D": buildCumulativeSeries(users, 7),
        "30D": buildCumulativeSeries(users, 30),
        "90D": buildCumulativeSeries(users, 90),
      },
    };
  }
}

export default new AdminDashboardService();
