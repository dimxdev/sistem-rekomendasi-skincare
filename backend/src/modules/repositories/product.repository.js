import prisma from "../../db/index.js";

class ProductRepository {
  async getProducts(filters) {
    const {
      search,
      country,
      type,
      skinType,
      concern,
      includeInactive,
      skip,
      limit,
    } = filters;

    const where = {
      ...(includeInactive ? {} : { isActive: true }),
    };

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

        _count: {
          select: {
            favorites: true,
          },
        },
      },

      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  }

  async countProducts(filters) {
    const { search, country, type, skinType, concern, includeInactive } =
      filters;

    const where = {
      ...(includeInactive ? {} : { isActive: true }),
    };

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

  async getProductDetail(productId, includeInactive = false) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },

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

        favorites: true,
      },
    });

    if (!product) {
      return null;
    }

    if (!includeInactive && !product.isActive) {
      return null;
    }

    return product;
  }
}

export default new ProductRepository();
