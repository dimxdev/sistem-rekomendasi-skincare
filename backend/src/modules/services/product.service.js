import productRepository from "../repositories/product.repository.js";

class ProductService {
  validateProductPayload(data) {
    const requiredFields = [
      ["namaProduk", "Nama produk"],
      ["brand", "Brand"],
      ["manfaatUtama", "Manfaat utama"],
      ["tokoOnlineUrl", "URL toko online"],
      ["countryId", "Negara"],
      ["productTypeId", "Tipe produk"],
    ];

    for (const [field, label] of requiredFields) {
      if (!data?.[field]) {
        throw new Error(`${label} wajib diisi!`);
      }
    }
  }

  async createProduct(data) {
    this.validateProductPayload(data);

    return productRepository.createProduct({
      namaProduk: data.namaProduk,
      brand: data.brand,
      manfaatUtama: data.manfaatUtama,
      tokoOnlineUrl: data.tokoOnlineUrl,
      imageUrl: data.imageUrl || null,
      countryId: data.countryId,
      productTypeId: data.productTypeId,
      skinTypeIds: data.skinTypeIds || [],
      concernIds: data.concernIds || [],
    });
  }

  async getProducts(query) {
    const page = Number(query.page) || 1;

    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const filters = {
      search: query.search,
      country: query.country,
      type: query.type,
      skinType: query.skinType,
      concern: query.concern,
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

    const product = await productRepository.getProductDetail(productId);

    if (!product) {
      throw new Error("Product tidak ditemukan!");
    }

    return product;
  }

  async updateProduct(productId, data) {
    if (!productId) {
      throw new Error("Product id wajib diisi!");
    }

    this.validateProductPayload(data);

    const existingProduct = await productRepository.getProductDetail(productId);

    if (!existingProduct) {
      throw new Error("Product tidak ditemukan!");
    }

    return productRepository.updateProduct(productId, {
      namaProduk: data.namaProduk,
      brand: data.brand,
      manfaatUtama: data.manfaatUtama,
      tokoOnlineUrl: data.tokoOnlineUrl,
      imageUrl: data.imageUrl || null,
      countryId: data.countryId,
      productTypeId: data.productTypeId,
      skinTypeIds: data.skinTypeIds || [],
      concernIds: data.concernIds || [],
    });
  }

  async deleteProduct(productId) {
    if (!productId) {
      throw new Error("Product id wajib diisi!");
    }

    const existingProduct = await productRepository.getProductDetail(productId);

    if (!existingProduct) {
      throw new Error("Product tidak ditemukan!");
    }

    return productRepository.deleteProduct(productId);
  }
}

export default new ProductService();
