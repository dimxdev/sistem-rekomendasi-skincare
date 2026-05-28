import prisma from "../../db/index.js";

class MasterDataRepository {
  async getCountries() {
    return prisma.country.findMany({
      select: {
        id: true,
        namaNegara: true,
        kodeNegara: true,
      },
      orderBy: {
        namaNegara: "asc",
      },
    });
  }

  async getProductTypes() {
    return prisma.productType.findMany({
      select: {
        id: true,
        nama: true,
      },
      orderBy: {
        nama: "asc",
      },
    });
  }

  async getSkinTypes() {
    return prisma.skinType.findMany({
      select: {
        id: true,
        nama: true,
      },
      orderBy: {
        nama: "asc",
      },
    });
  }

  async getConcerns() {
    return prisma.skinConcern.findMany({
      select: {
        id: true,
        nama: true,
      },
      orderBy: {
        nama: "asc",
      },
    });
  }
}

export default new MasterDataRepository();
