import skinConcernService from "../services/skin-concern.service.js";

const createSkinConcern = async (req, res) => {
  try {
    const skinConcern = await skinConcernService.addSkinConcern(req.body);
    res.status(201).json({ success: true, data: skinConcern });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getSkinConcerns = async (req, res) => {
  try {
    const skinConcerns = await skinConcernService.getAllSkinConcerns();
    res.status(200).json({ success: true, data: skinConcerns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSkinConcern = async (req, res) => {
  try {
    const skinConcern = await skinConcernService.editSkinConcern(
      req.params.id,
      req.body,
    );
    res.status(200).json({ success: true, data: skinConcern });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteSkinConcern = async (req, res) => {
  try {
    await skinConcernService.removeSkinConcern(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Skin Concern berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default {
  createSkinConcern,
  getSkinConcerns,
  updateSkinConcern,
  deleteSkinConcern,
};
