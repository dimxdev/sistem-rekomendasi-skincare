import productService from "../services/product.service.js";

class ProductController {
  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body);

      res.status(201).json({
        success: true,
        message: "Produk berhasil dibuat!",
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
        message: error.message,
      });
    }
  }

  async getProducts(req, res) {
    try {
      const result = await productService.getProducts(req.query);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async getProductDetail(req, res) {
    try {
      const { productId } = req.params;

      const product = await productService.getProductDetail(productId);

      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({
        error: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const product = await productService.updateProduct(productId, req.body);

      res.status(200).json({
        success: true,
        message: "Produk berhasil diperbarui!",
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
        message: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { productId } = req.params;
      await productService.deleteProduct(productId);

      res.status(200).json({
        success: true,
        message: "Produk berhasil dihapus!",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
        message: error.message,
      });
    }
  }
}

export default new ProductController();
