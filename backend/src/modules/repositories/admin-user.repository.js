import prisma from "../../db/index.js";

const createUser = async (data) => {
  return await prisma.user.create({ data });
};

const findAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      tanggalRegistrasi: true,
    },
  });
};

const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      tanggalRegistrasi: true,
    },
  });
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      tanggalRegistrasi: true,
    },
  });
};

const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id } });
};

export default {
  createUser,
  findAllUsers,
  findUserById,
  findUserByEmail,
  updateUser,
  deleteUser,
};
