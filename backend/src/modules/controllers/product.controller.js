import productService from "../services/product.service.js";

class ProductController {
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
}

export default new ProductController();
