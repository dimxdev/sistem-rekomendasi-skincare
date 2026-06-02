import prisma from "../../db/index.js";

const createSkinConcern = async (data) => {
  return await prisma.skinConcern.create({ data });
};

const findAllSkinConcerns = async () => {
  return await prisma.skinConcern.findMany();
};

const findSkinConcernById = async (id) => {
  return await prisma.skinConcern.findUnique({ where: { id } });
};

const findSkinConcernByName = async (nama) => {
  return await prisma.skinConcern.findUnique({ where: { nama } });
};

const updateSkinConcern = async (id, data) => {
  return await prisma.skinConcern.update({
    where: { id },
    data,
  });
};

const deleteSkinConcern = async (id) => {
  return await prisma.skinConcern.delete({ where: { id } });
};

export default {
  createSkinConcern,
  findAllSkinConcerns,
  findSkinConcernById,
  findSkinConcernByName,
  updateSkinConcern,
  deleteSkinConcern,
};
