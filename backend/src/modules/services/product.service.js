import productRepository from "../repositories/product.repository.js";

class ProductService {
  async getProducts(query) {
    const page = Number(query.page) || 1;

    const limit = Number(query.limit) || 10;

    const includeInactive = query.includeInactive === "true";

    const skip = (page - 1) * limit;

    const filters = {
      search: query.search,
      country: query.country,
      type: query.type,
      skinType: query.skinType,
      concern: query.concern,
      includeInactive,
      skip,
      limit,
    };

    const products = await productRepository.getProducts(filters);

    const total = await productRepository.countProducts(filters);

    return {
      data: products,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductDetail(productId) {
    if (!productId) {
      throw new Error("Product id wajib diisi!");
    }

    const includeInactive = query.includeInactive === "true";

    const product = await productRepository.getProductDetail(
      productId,
      includeInactive,
    );

    if (!product) {
      throw new Error("Product tidak ditemukan!");
    }

    return product;
  }
}

export default new ProductService();
