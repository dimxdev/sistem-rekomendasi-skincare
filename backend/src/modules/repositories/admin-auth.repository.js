import prisma from "../../db/index.js";

class AdminAuthRepository {
  async getAdminByUsername(username) {
    return prisma.admin.findUnique({
      where: {
        username,
      },
    });
  }
}

export default new AdminAuthRepository();
