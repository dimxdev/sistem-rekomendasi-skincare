import countryService from "../services/country.service.js";

const createCountry = async (req, res) => {
  try {
    const country = await countryService.addCountry(req.body);
    res.status(201).json({ success: true, data: country });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCountries = async (req, res) => {
  try {
    const countries = await countryService.getAllCountries();
    res.status(200).json({ success: true, data: countries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCountry = async (req, res) => {
  try {
    const country = await countryService.editCountry(req.params.id, req.body);
    res.status(200).json({ success: true, data: country });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCountry = async (req, res) => {
  try {
    await countryService.removeCountry(req.params.id);
    res.status(200).json({ success: true, message: "Country berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default {
  createCountry,
  getCountries,
  updateCountry,
  deleteCountry,
};
