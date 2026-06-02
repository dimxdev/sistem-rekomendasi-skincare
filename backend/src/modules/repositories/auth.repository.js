import prisma from "../../db/index.js";

class AuthRepository {
  async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(userId) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        tanggalRegistrasi: true,
      },
    });
  }

  async registerUser(userData) {
    return prisma.user.create({
      data: userData,
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        tanggalRegistrasi: true,
      },
    });
  }
}

export default new AuthRepository();
