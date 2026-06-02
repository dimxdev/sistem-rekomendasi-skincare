import masterDataService from "../services/master-data.service.js";

class MasterDataController {
  // === COUNTRIES ===
  async getCountries(req, res) {
    try {
      res.status(200).json(await masterDataService.getCountries());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async createCountry(req, res) {
    try {
      res
        .status(201)
        .json({
          message: "Berhasil",
          data: await masterDataService.createCountry(req.body),
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateCountry(req, res) {
    try {
      res
        .status(200)
        .json({
          message: "Berhasil",
          data: await masterDataService.updateCountry(req.params.id, req.body),
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async deleteCountry(req, res) {
    try {
      await masterDataService.deleteCountry(req.params.id);
      res.status(200).json({ message: "Berhasil dihapus" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // === PRODUCT TYPES ===
  async getProductTypes(req, res) {
    try {
      res.status(200).json(await masterDataService.getProductTypes());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async createProductType(req, res) {
    try {
      res
        .status(201)
        .json({
          message: "Berhasil",
          data: await masterDataService.createProductType(req.body),
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateProductType(req, res) {
    try {
      res
        .status(200)
        .json({
          message: "Berhasil",
          data: await masterDataService.updateProductType(
            req.params.id,
            req.body,
          ),
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async deleteProductType(req, res) {
    try {
      await masterDataService.deleteProductType(req.params.id);
      res.status(200).json({ message: "Berhasil dihapus" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // === SKIN TYPES ===
  async getSkinTypes(req, res) {
    try {
      res.status(200).json(await masterDataService.getSkinTypes());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async createSkinType(req, res) {
    try {
      res
        .status(201)
        .json({
          message: "Berhasil",
          data: await masterDataService.createSkinType(req.body),
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateSkinType(req, res) {
    try {
      res
        .status(200)
        .json({
          message: "Berhasil",
          data: await masterDataService.updateSkinType(req.params.id, req.body),
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async deleteSkinType(req, res) {
    try {
      await masterDataService.deleteSkinType(req.params.id);
      res.status(200).json({ message: "Berhasil dihapus" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // === SKIN CONCERNS ===
  async getConcerns(req, res) {
    try {
      res.status(200).json(await masterDataService.getConcerns());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async createConcern(req, res) {
    try {
      res
        .status(201)
        .json({
          message: "Berhasil",
          data: await masterDataService.createConcern(req.body),
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateConcern(req, res) {
    try {
      res
        .status(200)
        .json({
          message: "Berhasil",
          data: await masterDataService.updateConcern(req.params.id, req.body),
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async deleteConcern(req, res) {
    try {
      await masterDataService.deleteConcern(req.params.id);
      res.status(200).json({ message: "Berhasil dihapus" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new MasterDataController();
