import skinTypeRepo from "../repositories/skin-type.repository.js";

const addSkinType = async (data) => {
  if (!data.nama) {
    throw new Error("nama wajib diisi");
  }

  const existingType = await skinTypeRepo.findSkinTypeByName(data.nama);
  if (existingType) {
    throw new Error("nama sudah terdaftar (harus unique)");
  }

  return await skinTypeRepo.createSkinType({ nama: data.nama });
};

const getAllSkinTypes = async () => {
  return await skinTypeRepo.findAllSkinTypes();
};

const editSkinType = async (id, data) => {
  const existingType = await skinTypeRepo.findSkinTypeById(id);
  if (!existingType) {
    throw new Error("Skin Type tidak ditemukan");
  }

  if (data.nama && data.nama !== existingType.nama) {
    const duplicate = await skinTypeRepo.findSkinTypeByName(data.nama);
    if (duplicate) throw new Error("nama sudah terdaftar (harus unique)");
  }

  return await skinTypeRepo.updateSkinType(id, data);
};

const removeSkinType = async (id) => {
  const existingType = await skinTypeRepo.findSkinTypeById(id);
  if (!existingType) {
    throw new Error("Skin Type tidak ditemukan");
  }
  return await skinTypeRepo.deleteSkinType(id);
};

export default {
  addSkinType,
  getAllSkinTypes,
  editSkinType,
  removeSkinType,
};
