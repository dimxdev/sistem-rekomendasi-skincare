import masterDataRepository from "../repositories/master-data.repository.js";

class MasterDataService {
  async getCountries() {
    return masterDataRepository.getCountries();
  }

  async getProductTypes() {
    return masterDataRepository.getProductTypes();
  }

  async getSkinTypes() {
    return masterDataRepository.getSkinTypes();
  }

  async getConcerns() {
    return masterDataRepository.getConcerns();
  }
}

export default new MasterDataService();
