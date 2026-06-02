import adminAuthService from "../services/admin-auth.service.js";

class AdminAuthController {
  async login(req, res) {
    try {
      const result = await adminAuthService.login(req.body);

      res.status(200).json({
        message: "Admin login berhasil!",
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        error: error.message,
      });
    }
  }
}

export default new AdminAuthController();
