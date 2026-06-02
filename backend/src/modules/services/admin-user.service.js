import adminUserRepo from "../repositories/admin-user.repository.js";
import bcrypt from "bcrypt";

const addUser = async (data) => {
  if (!data.namaLengkap || !data.email || !data.password) {
    throw new Error("namaLengkap, email, dan password wajib diisi");
  }

  const existingUser = await adminUserRepo.findUserByEmail(data.email);
  if (existingUser) {
    throw new Error("email sudah terdaftar");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  return await adminUserRepo.createUser({
    namaLengkap: data.namaLengkap,
    email: data.email,
    passwordHash,
  });
};

const getAllUsers = async () => {
  return await adminUserRepo.findAllUsers();
};

const getUserById = async (id) => {
  const user = await adminUserRepo.findUserById(id);
  if (!user) {
    throw new Error("User tidak ditemukan");
  }
  return user;
};

const editUser = async (id, data) => {
  const existingUser = await adminUserRepo.findUserById(id);
  if (!existingUser) {
    throw new Error("User tidak ditemukan");
  }

  const updateData = {};
  if (data.namaLengkap) updateData.namaLengkap = data.namaLengkap;

  if (data.email && data.email !== existingUser.email) {
    const duplicate = await adminUserRepo.findUserByEmail(data.email);
    if (duplicate) throw new Error("email sudah terdaftar");
    updateData.email = data.email;
  }

  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  return await adminUserRepo.updateUser(id, updateData);
};

const removeUser = async (id) => {
  const existingUser = await adminUserRepo.findUserById(id);
  if (!existingUser) {
    throw new Error("User tidak ditemukan");
  }
  return await adminUserRepo.deleteUser(id);
};

export default {
  addUser,
  getAllUsers,
  getUserById,
  editUser,
  removeUser,
};
