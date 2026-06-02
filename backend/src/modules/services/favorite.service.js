import favoriteRepository from "../repositories/favorite.repository.js";

class FavoriteService {
  async addFavorite(userId, productId) {
    if (!productId) {
      throw new Error("Product id wajib diisi!");
    }

    const product = await favoriteRepository.findProductById(productId);

    if (!product) {
      throw new Error("Product tidak ditemukan!");
    }

    const existingFavorite = await favoriteRepository.findFavorite(
      userId,
      productId,
    );

    if (existingFavorite) {
      throw new Error("Product sudah ada di favorite!");
    }

    const favorite = await favoriteRepository.createFavorite(userId, productId);

    return favorite;
  }

  async removeFavorite(userId, productId) {
    const existingFavorite = await favoriteRepository.findFavorite(
      userId,
      productId,
    );

    if (!existingFavorite) {
      throw new Error("Favorite tidak ditemukan!");
    }

    await favoriteRepository.deleteFavorite(userId, productId);
  }

  async getFavorites(userId) {
    return favoriteRepository.getFavorites(userId);
  }
}

export default new FavoriteService();
