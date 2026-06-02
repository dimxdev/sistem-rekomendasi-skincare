import productTypeService from "../services/product-type.service.js";

const createProductType = async (req, res) => {
  try {
    const productType = await productTypeService.addProductType(req.body);
    res.status(201).json({ success: true, data: productType });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProductTypes = async (req, res) => {
  try {
    const productTypes = await productTypeService.getAllProductTypes();
    res.status(200).json({ success: true, data: productTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProductType = async (req, res) => {
  try {
    const productType = await productTypeService.editProductType(
      req.params.id,
      req.body,
    );
    res.status(200).json({ success: true, data: productType });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProductType = async (req, res) => {
  try {
    await productTypeService.removeProductType(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Product Type berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default {
  createProductType,
  getProductTypes,
  updateProductType,
  deleteProductType,
};
