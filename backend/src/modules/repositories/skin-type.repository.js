import prisma from "../../db/index.js";

const createSkinType = async (data) => {
  return await prisma.skinType.create({ data });
};

const findAllSkinTypes = async () => {
  return await prisma.skinType.findMany();
};

const findSkinTypeById = async (id) => {
  return await prisma.skinType.findUnique({ where: { id } });
};

const findSkinTypeByName = async (nama) => {
  return await prisma.skinType.findUnique({ where: { nama } });
};

const updateSkinType = async (id, data) => {
  return await prisma.skinType.update({
    where: { id },
    data,
  });
};

const deleteSkinType = async (id) => {
  return await prisma.skinType.delete({ where: { id } });
};

export default {
  createSkinType,
  findAllSkinTypes,
  findSkinTypeById,
  findSkinTypeByName,
  updateSkinType,
  deleteSkinType,
};
