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

  async deleteMe(userId) {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new Error("User tidak ditemukan!");
    return userRepository.deleteUser(userId);
  }

  async getAllUsersAdmin() {
    return userRepository.getAllUsers();
  }

  async getUserByIdAdmin(id) {
    const user = await userRepository.getUserById(id);
    if (!user) throw new Error("Pengguna tidak ditemukan");
    return user;
  }

  async updateUserAdmin(id, data) {
    if (!data.namaLengkap || !data.namaLengkap.trim())
      throw new Error("Nama lengkap wajib diisi");
    if (!data.email || !data.email.trim()) throw new Error("Email wajib diisi");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim()))
      throw new Error("Format email tidak valid");

    const user = await userRepository.getUserById(id);
    if (!user) throw new Error("Pengguna tidak ditemukan");

    if (user.email !== data.email.trim()) {
      const existingEmail = await userRepository.getUserByEmail(
        data.email.trim(),
      );
      if (existingEmail && existingEmail.id !== id) {
        throw new Error("Email sudah digunakan oleh pengguna lain");
      }
    }

    const isBanned =
      data.isBanned !== undefined ? Boolean(data.isBanned) : undefined;

    return userRepository.updateUser(id, {
      namaLengkap: data.namaLengkap.trim(),
      email: data.email.trim(),
      ...(isBanned !== undefined ? { isBanned } : {}),
    });
  }

  async deleteUserAdmin(id) {
    const user = await userRepository.getUserById(id);
    if (!user) throw new Error("Pengguna tidak ditemukan");
    return userRepository.deleteUser(id);
  }
}

export default new UserService();
