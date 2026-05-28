import adminProductService from "../services/admin-product.service.js";

class AdminProductController {
  async createProduct(req, res) {
    try {
      const payload = { ...req.body };

      if (typeof payload.skinTypeIds === "string") {
        payload.skinTypeIds = JSON.parse(payload.skinTypeIds);
      }

      if (typeof payload.concernIds === "string") {
        payload.concernIds = JSON.parse(payload.concernIds);
      }

      if (req.file) {
        payload.imageUrl = `/uploads/${req.file.filename}`;
      }

      const product = await adminProductService.createProduct(payload);

      res.status(201).json({
        message: "Product berhasil dibuat!",
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { productId } = req.params;

      await adminProductService.deleteProduct(productId);

      res.status(200).json({
        message: "Product berhasil dihapus!",
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

export default new AdminProductController();
