import userService from "../services/user.service.js";

class UserController {
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;

      const user = await userService.getCurrentUser(userId);

      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({
        error: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;

      const updatedUser = await userService.updateProfile(userId, req.body);

      res.status(200).json({
        message: "Profile berhasil diperbarui!",
        data: updatedUser,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

export default new UserController();
