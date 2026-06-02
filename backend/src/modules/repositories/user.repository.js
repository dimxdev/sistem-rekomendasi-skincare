import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const findAllUsers = () => prisma.users.findMany();
const findUserById = (id) =>
  prisma.users.findUnique({ where: { id: String(id) } });
const findUserByEmail = (email) => prisma.users.findFirst({ where: { email } });
const updateUser = (id, data) =>
  prisma.users.update({ where: { id: String(id) }, data });
const deleteUser = (id) => prisma.users.delete({ where: { id: String(id) } });

export default {
  findAllUsers,
  findUserById,
  findUserByEmail,
  updateUser,
  deleteUser,
};
