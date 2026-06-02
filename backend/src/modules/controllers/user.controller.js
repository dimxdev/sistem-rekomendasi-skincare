import userService from "../services/user.service.js";

class UserController {
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const user = await userService.getCurrentUser(userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updatedUser = await userService.updateProfile(userId, req.body);
      res
        .status(200)
        .json({ message: "Profile berhasil diperbarui!", data: updatedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  
  async getAllUsersAdmin(req, res) {
    try {
      const users = await userService.getAllUsersAdmin();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserByIdAdmin(req, res) {
    try {
      const user = await userService.getUserByIdAdmin(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUserAdmin(req, res) {
    try {
      const updatedUser = await userService.updateUserAdmin(
        req.params.id,
        req.body,
      );
      res
        .status(200)
        .json({
          message: "Data pengguna berhasil diperbarui",
          data: updatedUser,
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUserAdmin(req, res) {
    try {
      await userService.deleteUserAdmin(req.params.id);
      res
        .status(200)
        .json({ message: "Pengguna berhasil dihapus dari sistem" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();
