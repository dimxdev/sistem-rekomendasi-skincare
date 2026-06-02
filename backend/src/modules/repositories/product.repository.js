import prisma from "../../db/index.js";

class ProductRepository {
  getProductInclude() {
    return {
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
      favorites: true,
    };
  }

  async createProduct(data) {
    const { skinTypeIds, concernIds, ...productData } = data;

    return prisma.product.create({
      data: {
        ...productData,
        skinTypes: {
          create: skinTypeIds.map((skinTypeId) => ({
            skinType: {
              connect: { id: skinTypeId },
            },
          })),
        },
        concerns: {
          create: concernIds.map((concernId) => ({
            concern: {
              connect: { id: concernId },
            },
          })),
        },
      },
      include: this.getProductInclude(),
    });
  }

  async getProducts(filters) {
    const { search, country, type, skinType, concern, skip, limit } = filters;

    const where = {};

    // SEARCH PRODUCT NAME
    if (search) {
      where.namaProduk = {
        contains: search,
        mode: "insensitive",
      };
    }

    // FILTER COUNTRY
    if (country) {
      where.country = {
        namaNegara: {
          equals: country,
          mode: "insensitive",
        },
      };
    }

    // FILTER PRODUCT TYPE
    if (type) {
      where.productType = {
        nama: {
          equals: type,
          mode: "insensitive",
        },
      };
    }

    // FILTER SKIN TYPE
    if (skinType) {
      where.skinTypes = {
        some: {
          skinType: {
            nama: {
              equals: skinType,
              mode: "insensitive",
            },
          },
        },
      };
    }

    // FILTER SKIN CONCERN
    if (concern) {
      where.concerns = {
        some: {
          concern: {
            nama: {
              equals: concern,
              mode: "insensitive",
            },
          },
        },
      };
    }

    const products = await prisma.product.findMany({
      where,

      include: this.getProductInclude(),

      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  }

  async countProducts(filters) {
    const { search, country, type, skinType, concern } = filters;

    const where = {};

    // SEARCH
    if (search) {
      where.namaProduk = {
        contains: search,
        mode: "insensitive",
      };
    }

    // COUNTRY
    if (country) {
      where.country = {
        namaNegara: {
          equals: country,
          mode: "insensitive",
        },
      };
    }

    // TYPE
    if (type) {
      where.productType = {
        nama: {
          equals: type,
          mode: "insensitive",
        },
      };
    }

    // SKIN TYPE
    if (skinType) {
      where.skinTypes = {
        some: {
          skinType: {
            nama: {
              equals: skinType,
              mode: "insensitive",
            },
          },
        },
      };
    }

    // CONCERN
    if (concern) {
      where.concerns = {
        some: {
          concern: {
            nama: {
              equals: concern,
              mode: "insensitive",
            },
          },
        },
      };
    }

    return prisma.product.count({
      where,
    });
  }

  async getProductDetail(productId) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },

      include: this.getProductInclude(),
    });

    return product;
  }

  async updateProduct(productId, data) {
    const { skinTypeIds, concernIds, ...productData } = data;

    return prisma.$transaction(async (tx) => {
      await tx.productSkinType.deleteMany({
        where: { productId },
      });

      await tx.productConcern.deleteMany({
        where: { productId },
      });

      return tx.product.update({
        where: { id: productId },
        data: {
          ...productData,
          skinTypes: {
            create: skinTypeIds.map((skinTypeId) => ({
              skinType: {
                connect: { id: skinTypeId },
              },
            })),
          },
          concerns: {
            create: concernIds.map((concernId) => ({
              concern: {
                connect: { id: concernId },
              },
            })),
          },
        },
        include: this.getProductInclude(),
      });
    });
  }

  async deleteProduct(productId) {
    return prisma.product.delete({
      where: { id: productId },
    });
  }
}

export default new ProductRepository();
