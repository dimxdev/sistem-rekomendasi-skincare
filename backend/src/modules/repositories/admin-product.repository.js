import prisma from "../../db/index.js";

class AdminProductRepository {

  async createProduct(productData) {

    const {
      namaProduk,
      brand,
      manfaatUtama,
      tokoOnlineUrl,
      imageUrl,
      countryId,
      productTypeId,
      skinTypeIds,
      concernIds,
    } = productData;

    const product = await prisma.$transaction(
      async (tx) => {

        // CREATE PRODUCT
        const newProduct =
          await tx.product.create({
            data: {
              namaProduk,
              brand,
              manfaatUtama,
              tokoOnlineUrl,
              imageUrl,
              countryId,
              productTypeId,
            },
          });

        // CREATE SKIN TYPE RELATIONS
        if (
          skinTypeIds &&
          skinTypeIds.length > 0
        ) {

          await tx.productSkinType.createMany({
            data: skinTypeIds.map(
              (skinTypeId) => ({
                productId: newProduct.id,
                skinTypeId,
              })
            ),
          });
        }

        // CREATE CONCERN RELATIONS
        if (
          concernIds &&
          concernIds.length > 0
        ) {

          await tx.productConcern.createMany({
            data: concernIds.map(
              (concernId) => ({
                productId: newProduct.id,
                concernId,
              })
            ),
          });
        }

        return newProduct;
      }
    );

    return product;
  }

  async getProductById(productId) {

    return prisma.product.findUnique({
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
      },
    });
  }

  async deleteProduct(productId) {

    return prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }
}

export default new AdminProductRepository();