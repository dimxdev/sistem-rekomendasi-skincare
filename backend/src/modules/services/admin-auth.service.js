import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import adminAuthRepository from "../repositories/admin-auth.repository.js";

class AdminAuthService {
  async login(loginData) {
    const { username, password } = loginData;

    if (!username || !password) {
      throw new Error("Username dan password wajib diisi!");
    }

    const admin = await adminAuthRepository.getAdminByUsername(username);

    if (!admin) {
      throw new Error("Username tidak ditemukan!");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Password salah!");
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: "admin",
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    return {
      token,

      admin: {
        id: admin.id,
        username: admin.username,
      },
    };
  }
}

export default new AdminAuthService();
