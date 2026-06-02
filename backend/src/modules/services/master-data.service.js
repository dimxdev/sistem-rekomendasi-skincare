import masterDataRepository from "../repositories/master-data.repository.js";

class MasterDataService {
  // === COUNTRIES ===
  async getCountries() {
    return masterDataRepository.getCountries();
  }
  async createCountry(data) {
    if (!data.namaNegara || !data.namaNegara.trim())
      throw new Error("namaNegara wajib diisi");
    if (await masterDataRepository.findCountryByNama(data.namaNegara.trim()))
      throw new Error("namaNegara sudah terdaftar");
    return masterDataRepository.createCountry({
      namaNegara: data.namaNegara.trim(),
      kodeNegara: data.kodeNegara,
    });
  }
  async updateCountry(id, data) {
    if (!data.namaNegara || !data.namaNegara.trim())
      throw new Error("namaNegara wajib diisi");
    const existing = await masterDataRepository.findCountryById(id);
    if (!existing) throw new Error("Negara tidak ditemukan");
    if (
      existing.namaNegara.toLowerCase() !== data.namaNegara.trim().toLowerCase()
    ) {
      if (await masterDataRepository.findCountryByNama(data.namaNegara.trim()))
        throw new Error("namaNegara sudah terdaftar");
    }
    return masterDataRepository.updateCountry(id, {
      namaNegara: data.namaNegara.trim(),
      kodeNegara: data.kodeNegara,
    });
  }
  async deleteCountry(id) {
    if (!(await masterDataRepository.findCountryById(id)))
      throw new Error("Negara tidak ditemukan");
    return masterDataRepository.deleteCountry(id);
  }

  // === PRODUCT TYPES ===
  async getProductTypes() {
    return masterDataRepository.getProductTypes();
  }
  async createProductType(data) {
    if (!data.nama || !data.nama.trim()) throw new Error("nama wajib diisi");
    if (await masterDataRepository.findProductTypeByNama(data.nama.trim()))
      throw new Error("nama sudah terdaftar");
    return masterDataRepository.createProductType({ nama: data.nama.trim() });
  }
  async updateProductType(id, data) {
    if (!data.nama || !data.nama.trim()) throw new Error("nama wajib diisi");
    const existing = await masterDataRepository.findProductTypeById(id);
    if (!existing) throw new Error("Product Type tidak ditemukan");
    if (existing.nama.toLowerCase() !== data.nama.trim().toLowerCase()) {
      if (await masterDataRepository.findProductTypeByNama(data.nama.trim()))
        throw new Error("nama sudah terdaftar");
    }
    return masterDataRepository.updateProductType(id, {
      nama: data.nama.trim(),
    });
  }
  async deleteProductType(id) {
    if (!(await masterDataRepository.findProductTypeById(id)))
      throw new Error("Product Type tidak ditemukan");
    return masterDataRepository.deleteProductType(id);
  }

  // === SKIN TYPES ===
  async getSkinTypes() {
    return masterDataRepository.getSkinTypes();
  }
  async createSkinType(data) {
    if (!data.nama || !data.nama.trim()) throw new Error("nama wajib diisi");
    if (await masterDataRepository.findSkinTypeByNama(data.nama.trim()))
      throw new Error("nama sudah terdaftar");
    return masterDataRepository.createSkinType({ nama: data.nama.trim() });
  }
  async updateSkinType(id, data) {
    if (!data.nama || !data.nama.trim()) throw new Error("nama wajib diisi");
    const existing = await masterDataRepository.findSkinTypeById(id);
    if (!existing) throw new Error("Skin Type tidak ditemukan");
    if (existing.nama.toLowerCase() !== data.nama.trim().toLowerCase()) {
      if (await masterDataRepository.findSkinTypeByNama(data.nama.trim()))
        throw new Error("nama sudah terdaftar");
    }
    return masterDataRepository.updateSkinType(id, { nama: data.nama.trim() });
  }
  async deleteSkinType(id) {
    if (!(await masterDataRepository.findSkinTypeById(id)))
      throw new Error("Skin Type tidak ditemukan");
    return masterDataRepository.deleteSkinType(id);
  }

  // === SKIN CONCERNS ===
  async getConcerns() {
    return masterDataRepository.getConcerns();
  }
  async createConcern(data) {
    if (!data.nama || !data.nama.trim()) throw new Error("nama wajib diisi");
    if (await masterDataRepository.findConcernByNama(data.nama.trim()))
      throw new Error("nama sudah terdaftar");
    return masterDataRepository.createConcern({ nama: data.nama.trim() });
  }
  async updateConcern(id, data) {
    if (!data.nama || !data.nama.trim()) throw new Error("nama wajib diisi");
    const existing = await masterDataRepository.findConcernById(id);
    if (!existing) throw new Error("Skin Concern tidak ditemukan");
    if (existing.nama.toLowerCase() !== data.nama.trim().toLowerCase()) {
      if (await masterDataRepository.findConcernByNama(data.nama.trim()))
        throw new Error("nama sudah terdaftar");
    }
    return masterDataRepository.updateConcern(id, { nama: data.nama.trim() });
  }
  async deleteConcern(id) {
    if (!(await masterDataRepository.findConcernById(id)))
      throw new Error("Skin Concern tidak ditemukan");
    return masterDataRepository.deleteConcern(id);
  }
}

export default new MasterDataService();
