import userRepository from "../repositories/user.repository.js";

class UserService {
  async getCurrentUser(userId) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new Error("User tidak ditemukan!");
    }

    return user;
  }

  async updateProfile(userId, userData) {
    if (!userData.namaLengkap || !userData.email) {
      throw new Error("Nama lengkap dan email wajib diisi!");
    }

    const currentUser = await userRepository.getUserById(userId);

    if (!currentUser) {
      throw new Error("User tidak ditemukan!");
    }

    // CHECK EMAIL DUPLICATE
    const existingEmail = await userRepository.getUserByEmail(userData.email);

    if (existingEmail && existingEmail.id !== userId) {
      throw new Error("Email sudah digunakan!");
    }

    const updatedUser = await userRepository.updateUser(userId, userData);

    return updatedUser;
  }
}

export default new UserService();
