import prisma from "../../db/index.js";

class UserRepository {
  async getUserById(userId) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        tanggalRegistrasi: true,
        // Ditambahkan untuk admin melihat jumlah favorit (tidak mengganggu fitur user)
        _count: { select: { favorites: true } },
      },
    });
  }

  async getUserByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async updateUser(userId, userData) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        namaLengkap: userData.namaLengkap,
        email: userData.email,
      },
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        tanggalRegistrasi: true,
      },
    });
  }

  async getAllUsers() {
    return prisma.user.findMany({
      orderBy: { tanggalRegistrasi: "desc" },
      include: {
        _count: {
          select: { favorites: true },
        },
      },
    });
  }

  async deleteUser(id) {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserRepository();
