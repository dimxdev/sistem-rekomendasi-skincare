import prisma from "../../db/index.js";

const createCountry = async (data) => {
  return await prisma.country.create({ data });
};

const findAllCountries = async () => {
  return await prisma.country.findMany();
};

const findCountryById = async (id) => {
  return await prisma.country.findUnique({ where: { id } });
};

const findCountryByName = async (namaNegara) => {
  return await prisma.country.findUnique({ where: { namaNegara } });
};

const updateCountry = async (id, data) => {
  return await prisma.country.update({
    where: { id },
    data,
  });
};

const deleteCountry = async (id) => {
  return await prisma.country.delete({ where: { id } });
};

export default {
  createCountry,
  findAllCountries,
  findCountryById,
  findCountryByName,
  updateCountry,
  deleteCountry,
};
