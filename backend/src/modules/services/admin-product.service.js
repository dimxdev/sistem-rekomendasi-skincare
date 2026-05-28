import adminProductRepository from "../repositories/admin-product.repository.js";

class AdminProductService {

  async createProduct(productData) {

    const {
      namaProduk,
      brand,
      manfaatUtama,
      tokoOnlineUrl,
      countryId,
      productTypeId,
    } = productData;

    if (
      !namaProduk ||
      !brand ||
      !manfaatUtama ||
      !tokoOnlineUrl ||
      !countryId ||
      !productTypeId
    ) {
      throw new Error(
        "Data produk tidak lengkap!"
      );
    }

    const product =
      await adminProductRepository.createProduct(
        productData
      );

    return product;
  }

  async deleteProduct(productId) {

    const product =
      await adminProductRepository.getProductById(
        productId
      );

    if (!product) {
      throw new Error(
        "Product tidak ditemukan!"
      );
    }

    await adminProductRepository.deleteProduct(
      productId
    );
  }
}

export default new AdminProductService();