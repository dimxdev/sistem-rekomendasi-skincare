import skinTypeService from "../services/kin-type.service.js";

const createSkinType = async (req, res) => {
  try {
    const skinType = await skinTypeService.addSkinType(req.body);
    res.status(201).json({ success: true, data: skinType });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getSkinTypes = async (req, res) => {
  try {
    const skinTypes = await skinTypeService.getAllSkinTypes();
    res.status(200).json({ success: true, data: skinTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSkinType = async (req, res) => {
  try {
    const skinType = await skinTypeService.editSkinType(req.params.id, req.body);
    res.status(200).json({ success: true, data: skinType });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteSkinType = async (req, res) => {
  try {
    await skinTypeService.removeSkinType(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Skin Type berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default {
  createSkinType,
  getSkinTypes,
  updateSkinType,
  deleteSkinType,
};
