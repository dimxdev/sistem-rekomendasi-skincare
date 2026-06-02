import productTypeRepo from "../repositories/product-type.repository.js";

const addProductType = async (data) => {
  if (!data.nama) {
    throw new Error("nama wajib diisi");
  }

  const existingType = await productTypeRepo.findProductTypeByName(data.nama);
  if (existingType) {
    throw new Error("nama sudah terdaftar (harus unique)");
  }

  return await productTypeRepo.createProductType({ nama: data.nama });
};

const getAllProductTypes = async () => {
  return await productTypeRepo.findAllProductTypes();
};

const editProductType = async (id, data) => {
  const existingType = await productTypeRepo.findProductTypeById(id);
  if (!existingType) {
    throw new Error("Product Type tidak ditemukan");
  }

  if (data.nama && data.nama !== existingType.nama) {
    const duplicate = await productTypeRepo.findProductTypeByName(data.nama);
    if (duplicate) throw new Error("nama sudah terdaftar (harus unique)");
  }

  return await productTypeRepo.updateProductType(id, data);
};

const removeProductType = async (id) => {
  const existingType = await productTypeRepo.findProductTypeById(id);
  if (!existingType) {
    throw new Error("Product Type tidak ditemukan");
  }
  return await productTypeRepo.deleteProductType(id);
};

export default {
  addProductType,
  getAllProductTypes,
  editProductType,
  removeProductType,
};
