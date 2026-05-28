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

  async updateProduct(req, res) {
    try {
      const { productId } = req.params;
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

      const product = await adminProductService.updateProduct(
        productId,
        payload,
      );

      res.status(200).json({
        message: "Product berhasil diperbarui!",
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async toggleProductStatus(req, res) {
    try {
      const { productId } = req.params;
      const { isActive } = req.body;

      const parsedIsActive =
        typeof isActive === "boolean" ? isActive : isActive === "true";

      const product = await adminProductService.toggleProductStatus(
        productId,
        parsedIsActive,
      );

      res.status(200).json({
        message: "Status product berhasil diperbarui!",
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

export default new AdminProductController();
