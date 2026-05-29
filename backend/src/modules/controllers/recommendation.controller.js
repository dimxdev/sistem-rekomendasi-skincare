import recommendationService from "../services/recommendation.service.js";

class RecommendationController {
  async getRecommendations(req, res) {
    try {
      const recommendations = await recommendationService.getRecommendations(
        req.body,
      );

      res.status(200).json(recommendations);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

export default new RecommendationController();
