import userService from "../services/user.service.js";

const handleReq = async (res, action) => {
  try {
    const data = await action();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getCurrentUser = (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: "User tidak diautentikasi" });
    }
    handleReq(res, () => userService.getUserById(userId));
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateProfile = (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: "User tidak diautentikasi" });
    }
    handleReq(res, () => userService.editUser(userId, req.body));
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getAllUsers = (req, res) => handleReq(res, () => userService.getAllUsers());

const getUserById = (req, res) => handleReq(res, () => userService.getUserById(req.params.id));

const updateUser = (req, res) => handleReq(res, () => userService.editUser(req.params.id, req.body));

const deleteUser = (req, res) => handleReq(res, () => userService.removeUser(req.params.id));

export default {
  getCurrentUser,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};