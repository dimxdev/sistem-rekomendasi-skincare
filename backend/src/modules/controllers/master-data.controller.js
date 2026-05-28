import masterDataService from "../services/master-data.service.js";

class MasterDataController {
  async getCountries(req, res) {
    try {
      const countries = await masterDataService.getCountries();
      res.status(200).json(countries);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProductTypes(req, res) {
    try {
      const productTypes = await masterDataService.getProductTypes();
      res.status(200).json(productTypes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSkinTypes(req, res) {
    try {
      const skinTypes = await masterDataService.getSkinTypes();
      res.status(200).json(skinTypes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getConcerns(req, res) {
    try {
      const concerns = await masterDataService.getConcerns();
      res.status(200).json(concerns);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new MasterDataController();
