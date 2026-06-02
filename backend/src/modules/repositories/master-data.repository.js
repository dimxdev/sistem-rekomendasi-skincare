import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// --- COUNTRY ---
const createCountry = (data) => prisma.country.create({ data });
const findAllCountries = () => prisma.country.findMany();
const findCountryById = (id) =>
  prisma.country.findUnique({ where: { id } });
const findCountryByName = (namaNegara) =>
  prisma.country.findFirst({ where: { namaNegara } });
const updateCountry = (id, data) =>
  prisma.country.update({ where: { id }, data });
const deleteCountry = (id) =>
  prisma.country.delete({ where: { id } });

// --- PRODUCT TYPE ---
const createProductType = (data) => prisma.productType.create({ data });
const findAllProductTypes = () => prisma.productType.findMany();
const findProductTypeById = (id) =>
  prisma.productType.findUnique({ where: { id } });
const findProductTypeByName = (nama) =>
  prisma.productType.findFirst({ where: { nama } });
const updateProductType = (id, data) =>
  prisma.productType.update({ where: { id }, data });
const deleteProductType = (id) =>
  prisma.productType.delete({ where: { id } });

// --- SKIN TYPE ---
const createSkinType = (data) => prisma.skinType.create({ data });
const findAllSkinTypes = () => prisma.skinType.findMany();
const findSkinTypeById = (id) =>
  prisma.skinType.findUnique({ where: { id } });
const findSkinTypeByName = (nama) =>
  prisma.skinType.findFirst({ where: { nama } });
const updateSkinType = (id, data) =>
  prisma.skinType.update({ where: { id }, data });
const deleteSkinType = (id) =>
  prisma.skinType.delete({ where: { id } });

// --- SKIN CONCERN ---
const createConcern = (data) => prisma.skinConcern.create({ data });
const findAllConcerns = () => prisma.skinConcern.findMany();
const findConcernById = (id) =>
  prisma.skinConcern.findUnique({ where: { id } });
const findConcernByName = (nama) =>
  prisma.skinConcern.findFirst({ where: { nama } });
const updateConcern = (id, data) =>
  prisma.skinConcern.update({ where: { id }, data });
const deleteConcern = (id) =>
  prisma.skinConcern.delete({ where: { id } });

export default {
  createCountry,
  findAllCountries,
  findCountryById,
  findCountryByName,
  updateCountry,
  deleteCountry,
  createProductType,
  findAllProductTypes,
  findProductTypeById,
  findProductTypeByName,
  updateProductType,
  deleteProductType,
  createSkinType,
  findAllSkinTypes,
  findSkinTypeById,
  findSkinTypeByName,
  updateSkinType,
  deleteSkinType,
  createConcern,
  findAllConcerns,
  findConcernById,
  findConcernByName,
  updateConcern,
  deleteConcern,
};
