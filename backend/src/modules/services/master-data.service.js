import masterDataRepo from "../repositories/master-data.repository.js";

// --- COUNTRY ---
const addCountry = async (data) => {
  if (!data.namaNegara) throw new Error("namaNegara wajib diisi");
  const existing = await masterDataRepo.findCountryByName(data.namaNegara);
  if (existing) throw new Error("namaNegara sudah terdaftar (harus unique)");
  return await masterDataRepo.createCountry({
    namaNegara: data.namaNegara,
    kodeNegara: data.kodeNegara || null,
  });
};
const getAllCountries = async () => await masterDataRepo.findAllCountries();
const editCountry = async (id, data) => {
  const existing = await masterDataRepo.findCountryById(id);
  if (!existing) throw new Error("Negara tidak ditemukan");
  if (data.namaNegara && data.namaNegara !== existing.namaNegara) {
    const duplicate = await masterDataRepo.findCountryByName(data.namaNegara);
    if (duplicate) throw new Error("namaNegara sudah terdaftar (harus unique)");
  }
  return await masterDataRepo.updateCountry(id, data);
};
const removeCountry = async (id) => {
  const existing = await masterDataRepo.findCountryById(id);
  if (!existing) throw new Error("Negara tidak ditemukan");
  return await masterDataRepo.deleteCountry(id);
};

// --- PRODUCT TYPE ---
const addProductType = async (data) => {
  if (!data.nama) throw new Error("Nama tipe produk wajib diisi");
  const existing = await masterDataRepo.findProductTypeByName(data.nama);
  if (existing) throw new Error("Nama tipe produk sudah terdaftar");
  return await masterDataRepo.createProductType({ nama: data.nama });
};
const getAllProductTypes = async () => await masterDataRepo.findAllProductTypes();
const editProductType = async (id, data) => {
  if (data.nama) {
    const duplicate = await masterDataRepo.findProductTypeByName(data.nama);
    if (duplicate && duplicate.id !== Number(id)) throw new Error("Nama tipe produk sudah terdaftar");
  }
  return await masterDataRepo.updateProductType(id, data);
};
const removeProductType = async (id) => await masterDataRepo.deleteProductType(id);

// --- SKIN TYPE ---
const addSkinType = async (data) => {
  if (!data.nama) throw new Error("Nama tipe kulit wajib diisi");
  const existing = await masterDataRepo.findSkinTypeByName(data.nama);
  if (existing) throw new Error("Nama tipe kulit sudah terdaftar");
  return await masterDataRepo.createSkinType({ nama: data.nama });
};
const getAllSkinTypes = async () => await masterDataRepo.findAllSkinTypes();
const editSkinType = async (id, data) => {
  if (data.nama) {
    const duplicate = await masterDataRepo.findSkinTypeByName(data.nama);
    if (duplicate && duplicate.id !== Number(id)) throw new Error("Nama tipe kulit sudah terdaftar");
  }
  return await masterDataRepo.updateSkinType(id, data);
};
const removeSkinType = async (id) => await masterDataRepo.deleteSkinType(id);

// --- SKIN CONCERN ---
const addConcern = async (data) => {
  if (!data.nama) throw new Error("Nama masalah kulit wajib diisi");
  const existing = await masterDataRepo.findConcernByName(data.nama);
  if (existing) throw new Error("Nama masalah kulit sudah terdaftar");
  return await masterDataRepo.createConcern({ nama: data.nama });
};
const getAllConcerns = async () => await masterDataRepo.findAllConcerns();
const editConcern = async (id, data) => {
  if (data.nama) {
    const duplicate = await masterDataRepo.findConcernByName(data.nama);
    if (duplicate && duplicate.id !== Number(id)) throw new Error("Nama masalah kulit sudah terdaftar");
  }
  return await masterDataRepo.updateConcern(id, data);
};
const removeConcern = async (id) => await masterDataRepo.deleteConcern(id);

export default {
  addCountry, getAllCountries, editCountry, removeCountry,
  addProductType, getAllProductTypes, editProductType, removeProductType,
  addSkinType, getAllSkinTypes, editSkinType, removeSkinType,
  addConcern, getAllConcerns, editConcern, removeConcern
};