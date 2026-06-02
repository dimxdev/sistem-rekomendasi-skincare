import adminDashboardService from "../services/admin-dashboard.service.js";

class AdminDashboardController {
  async getSummary(req, res) {
    try {
      const summary = await adminDashboardService.getSummary();

      res.status(200).json(summary);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

export default new AdminDashboardController();
