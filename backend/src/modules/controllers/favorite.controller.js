import favoriteService from "../services/favorite.service.js";

class FavoriteController {
  async addFavorite(req, res) {
    try {
      const userId = req.user.id;

      const { productId } = req.body;

      const favorite = await favoriteService.addFavorite(userId, productId);

      res.status(201).json({
        message: "Berhasil menambahkan favorite!",
        data: favorite,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async removeFavorite(req, res) {
    try {
      const userId = req.user.id;

      const { productId } = req.params;

      await favoriteService.removeFavorite(userId, productId);

      res.status(200).json({
        message: "Favorite berhasil dihapus!",
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async getFavorites(req, res) {
    try {
      const userId = req.user.id;

      const favorites = await favoriteService.getFavorites(userId);

      res.status(200).json(favorites);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

export default new FavoriteController();
