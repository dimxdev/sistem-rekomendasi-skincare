import userRepository from "../repositories/user.repository.js";

const getAllUsers = async () => await userRepository.findAllUsers();

const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) throw new Error("User tidak ditemukan");
  return user;
};

const editUser = async (id, data) => {
  if (!data.namaLengkap) throw new Error("Nama lengkap wajib diisi");
  if (!data.email) throw new Error("Email wajib diisi");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) throw new Error("Email tidak valid");

  const existingUser = await userRepository.findUserById(id);
  if (!existingUser) throw new Error("User tidak ditemukan");

  if (data.email !== existingUser.email) {
    const duplicate = await userRepository.findUserByEmail(data.email);
    if (duplicate) throw new Error("Email sudah terdaftar pada akun lain");
  }
  return await userRepository.updateUser(id, {
    namaLengkap: data.namaLengkap,
    email: data.email,
  });
};
const removeUser = async (id) => await userRepository.deleteUser(id);

export default { getAllUsers, getUserById, editUser, removeUser };
