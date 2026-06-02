import skinConcernRepo from "../repositories/skin-concern.repository.js";

const addSkinConcern = async (data) => {
  if (!data.nama) {
    throw new Error("nama wajib diisi");
  }

  const existingConcern = await skinConcernRepo.findSkinConcernByName(
    data.nama,
  );
  if (existingConcern) {
    throw new Error("nama sudah terdaftar (harus unique)");
  }

  return await skinConcernRepo.createSkinConcern({ nama: data.nama });
};

const getAllSkinConcerns = async () => {
  return await skinConcernRepo.findAllSkinConcerns();
};

const editSkinConcern = async (id, data) => {
  const existingConcern = await skinConcernRepo.findSkinConcernById(id);
  if (!existingConcern) {
    throw new Error("Skin Concern tidak ditemukan");
  }

  if (data.nama && data.nama !== existingConcern.nama) {
    const duplicate = await skinConcernRepo.findSkinConcernByName(data.nama);
    if (duplicate) throw new Error("nama sudah terdaftar (harus unique)");
  }

  return await skinConcernRepo.updateSkinConcern(id, data);
};

const removeSkinConcern = async (id) => {
  const existingConcern = await skinConcernRepo.findSkinConcernById(id);
  if (!existingConcern) {
    throw new Error("Skin Concern tidak ditemukan");
  }
  return await skinConcernRepo.deleteSkinConcern(id);
};

export default {
  addSkinConcern,
  getAllSkinConcerns,
  editSkinConcern,
  removeSkinConcern,
};
