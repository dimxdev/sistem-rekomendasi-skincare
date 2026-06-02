import prisma from "../../db/index.js";

class MasterDataRepository {
  // ================= COUNTRIES =================
  async getCountries() {
    return prisma.country.findMany({ orderBy: { namaNegara: "asc" } });
  }
  async findCountryById(id) {
    return prisma.country.findUnique({ where: { id } });
  }
  async findCountryByNama(namaNegara) {
    return prisma.country.findUnique({ where: { namaNegara } });
  }
  async createCountry(data) {
    return prisma.country.create({ data });
  }
  async updateCountry(id, data) {
    return prisma.country.update({ where: { id }, data });
  }
  async deleteCountry(id) {
    return prisma.country.delete({ where: { id } });
  }

  // ================= PRODUCT TYPES =================
  async getProductTypes() {
    return prisma.productType.findMany({ orderBy: { nama: "asc" } });
  }
  async findProductTypeById(id) {
    return prisma.productType.findUnique({ where: { id } });
  }
  async findProductTypeByNama(nama) {
    return prisma.productType.findUnique({ where: { nama } });
  }
  async createProductType(data) {
    return prisma.productType.create({ data });
  }
  async updateProductType(id, data) {
    return prisma.productType.update({ where: { id }, data });
  }
  async deleteProductType(id) {
    return prisma.productType.delete({ where: { id } });
  }

  // ================= SKIN TYPES =================
  async getSkinTypes() {
    return prisma.skinType.findMany({ orderBy: { nama: "asc" } });
  }
  async findSkinTypeById(id) {
    return prisma.skinType.findUnique({ where: { id } });
  }
  async findSkinTypeByNama(nama) {
    return prisma.skinType.findUnique({ where: { nama } });
  }
  async createSkinType(data) {
    return prisma.skinType.create({ data });
  }
  async updateSkinType(id, data) {
    return prisma.skinType.update({ where: { id }, data });
  }
  async deleteSkinType(id) {
    return prisma.skinType.delete({ where: { id } });
  }

  // ================= SKIN CONCERNS =================
  async getConcerns() {
    return prisma.skinConcern.findMany({ orderBy: { nama: "asc" } });
  }
  async findConcernById(id) {
    return prisma.skinConcern.findUnique({ where: { id } });
  }
  async findConcernByNama(nama) {
    return prisma.skinConcern.findUnique({ where: { nama } });
  }
  async createConcern(data) {
    return prisma.skinConcern.create({ data });
  }
  async updateConcern(id, data) {
    return prisma.skinConcern.update({ where: { id }, data });
  }
  async deleteConcern(id) {
    return prisma.skinConcern.delete({ where: { id } });
  }
}

export default new MasterDataRepository();
