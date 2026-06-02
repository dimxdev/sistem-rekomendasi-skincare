import masterDataService from "../services/master-data.service.js";

// Helper untuk format response
const handleReq = async (res, action) => {
  try {
    const data = await action();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- COUNTRY ---
const addCountry = (req, res) =>
  handleReq(res, () => masterDataService.addCountry(req.body));
const getCountries = (req, res) =>
  handleReq(res, () => masterDataService.getAllCountries());
const editCountry = (req, res) =>
  handleReq(res, () => masterDataService.editCountry(req.params.id, req.body));
const removeCountry = (req, res) =>
  handleReq(res, () => masterDataService.removeCountry(req.params.id));

// --- PRODUCT TYPE ---
const addProductType = (req, res) =>
  handleReq(res, () => masterDataService.addProductType(req.body));
const getProductTypes = (req, res) =>
  handleReq(res, () => masterDataService.getAllProductTypes());
const editProductType = (req, res) =>
  handleReq(res, () =>
    masterDataService.editProductType(req.params.id, req.body),
  );
const removeProductType = (req, res) =>
  handleReq(res, () => masterDataService.removeProductType(req.params.id));

// --- SKIN TYPE ---
const addSkinType = (req, res) =>
  handleReq(res, () => masterDataService.addSkinType(req.body));
const getSkinTypes = (req, res) =>
  handleReq(res, () => masterDataService.getAllSkinTypes());
const editSkinType = (req, res) =>
  handleReq(res, () => masterDataService.editSkinType(req.params.id, req.body));
const removeSkinType = (req, res) =>
  handleReq(res, () => masterDataService.removeSkinType(req.params.id));

// --- SKIN CONCERN ---
const addConcern = (req, res) =>
  handleReq(res, () => masterDataService.addConcern(req.body));
const getConcerns = (req, res) =>
  handleReq(res, () => masterDataService.getAllConcerns());
const editConcern = (req, res) =>
  handleReq(res, () => masterDataService.editConcern(req.params.id, req.body));
const removeConcern = (req, res) =>
  handleReq(res, () => masterDataService.removeConcern(req.params.id));

export default {
  addCountry,
  getCountries,
  editCountry,
  removeCountry,
  addProductType,
  getProductTypes,
  editProductType,
  removeProductType,
  addSkinType,
  getSkinTypes,
  editSkinType,
  removeSkinType,
  addConcern,
  getConcerns,
  editConcern,
  removeConcern,
};
