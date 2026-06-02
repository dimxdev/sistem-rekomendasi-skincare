import prisma from "../../db/index.js";

const createProductType = async (data) => {
  return await prisma.productType.create({ data });
};

const findAllProductTypes = async () => {
  return await prisma.productType.findMany();
};

const findProductTypeById = async (id) => {
  return await prisma.productType.findUnique({ where: { id } });
};

const findProductTypeByName = async (nama) => {
  return await prisma.productType.findUnique({ where: { nama } });
};

const updateProductType = async (id, data) => {
  return await prisma.productType.update({
    where: { id },
    data,
  });
};

const deleteProductType = async (id) => {
  return await prisma.productType.delete({ where: { id } });
};

export default {
  createProductType,
  findAllProductTypes,
  findProductTypeById,
  findProductTypeByName,
  updateProductType,
  deleteProductType,
};
