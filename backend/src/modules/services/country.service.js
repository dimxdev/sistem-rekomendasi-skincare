import countryRepo from "../repositories/country.repository.js";

const addCountry = async (data) => {
  if (!data.namaNegara) {
    throw new Error("namaNegara wajib diisi");
  }

  const existingCountry = await countryRepo.findCountryByName(data.namaNegara);
  if (existingCountry) {
    throw new Error("namaNegara sudah terdaftar (harus unique)");
  }

  return await countryRepo.createCountry({
    namaNegara: data.namaNegara,
    kodeNegara: data.kodeNegara || null,
  });
};

const getAllCountries = async () => {
  return await countryRepo.findAllCountries();
};

const editCountry = async (id, data) => {
  const existingCountry = await countryRepo.findCountryById(id);
  if (!existingCountry) {
    throw new Error("Country tidak ditemukan");
  }

  if (data.namaNegara && data.namaNegara !== existingCountry.namaNegara) {
    const duplicate = await countryRepo.findCountryByName(data.namaNegara);
    if (duplicate) throw new Error("namaNegara sudah terdaftar (harus unique)");
  }

  return await countryRepo.updateCountry(id, data);
};

const removeCountry = async (id) => {
  const existingCountry = await countryRepo.findCountryById(id);
  if (!existingCountry) {
    throw new Error("Country tidak ditemukan");
  }
  return await countryRepo.deleteCountry(id);
};

export default {
  addCountry,
  getAllCountries,
  editCountry,
  removeCountry,
};
