import prisma from "../../db/index.js";

class RecommendationRepository {
  async getProductsWithRelations() {
    return prisma.product.findMany({
      include: {
        country: true,
        productType: true,
        skinTypes: {
          include: {
            skinType: true,
          },
        },
        concerns: {
          include: {
            concern: true,
          },
        },
      },
    });
  }
}

export default new RecommendationRepository();
