import bcrypt from "bcrypt";

import authRepository from "../repositories/auth.repository.js";
import { generateToken } from "../../utils/jwt.js";

class AuthService {
  async register(userData) {
    const { namaLengkap, email, password } = userData;

    if (!namaLengkap || !email || !password) {
      throw new Error("Data tidak lengkap!");
    }

    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new Error("Email sudah digunakan!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await authRepository.registerUser({
      namaLengkap,
      email,
      passwordHash: hashedPassword,
    });

    return newUser;
  }

  async login(loginData) {
    const { email, password } = loginData;

    if (!email || !password) {
      throw new Error("Email dan password wajib diisi!");
    }

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Email tidak ditemukan!");
    }

    if (user.isBanned) {
      throw new Error("Akun kamu telah dibanned!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Password salah!");
    }

    const token = generateToken({
      id: user.id,
      role: "user",
    });

    return {
      token,
      user: {
        id: user.id,
        namaLengkap: user.namaLengkap,
        email: user.email,
      },
    };
  }

  async me(userId) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new Error("User tidak ditemukan!");
    }

    return user;
  }
}

export default new AuthService();
