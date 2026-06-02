import prisma from "../../db/index.js";

class AdminDashboardRepository {
  async getProductsWithFavoriteCounts() {
    return prisma.product.findMany({
      select: {
        id: true,
        namaProduk: true,
        brand: true,
        imageUrl: true,
        createdAt: true,
        isActive: true,
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });
  }

  async getUsersForDashboard() {
    return prisma.user.findMany({
      select: {
        id: true,
        namaLengkap: true,
        tanggalRegistrasi: true,
      },
      orderBy: {
        tanggalRegistrasi: "desc",
      },
    });
  }

  async getFavoritesForDashboard() {
    return prisma.favorite.findMany({
      select: {
        id: true,
        tanggalDitambahkan: true,
      },
    });
  }
}

export default new AdminDashboardRepository();
