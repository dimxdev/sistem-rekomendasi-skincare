import authService from "../services/auth.service.js";

class AuthController {
  async register(req, res) {
    try {
      const newUser = await authService.register(req.body);

      res.status(201).json({
        message: "Register berhasil!",
        data: newUser,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        message: "Login berhasil!",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async me(req, res) {
    try {
      const user = await authService.me(req.user.id);

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

export default new AuthController();
