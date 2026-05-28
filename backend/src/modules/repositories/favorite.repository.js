import prisma from "../../db/index.js";

class FavoriteRepository {
  async findFavorite(userId, productId) {
    return prisma.favorite.findFirst({
      where: {
        userId,
        productId,
      },
    });
  }

  async createFavorite(userId, productId) {
    return prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async deleteFavorite(userId, productId) {
    return prisma.favorite.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  }

  async getFavorites(userId) {
    return prisma.favorite.findMany({
      where: {
        userId,
      },

      include: {
        product: {
          include: {
            country: true,
            productType: true,
          },
        },
      },
    });
  }

  async findProductById(productId) {
    return prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
  }
}

export default new FavoriteRepository();
