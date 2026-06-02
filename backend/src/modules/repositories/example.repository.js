// File di dalam folder repositories fungsinya query ke database

import prisma from "../../db/index.js";
import bcrypt from "bcrypt";

class ExampleRepository {
  async getAllExamples() {
    const examples = await prisma.user.findMany();

    return examples;
  }

  async getExampleById(exampleId) {
    const example = await prisma.user.findUnique({
      where: {
        id: exampleId,
      },
    });
    return example;
  }

  async createExample(exampleData) {
    const newExample = await prisma.user.create({
      data: {
        namaLengkap: exampleData.namaLengkap,
        email: exampleData.email,
        passwordHash: await bcrypt.hash(exampleData.password, 10),
      },
    });

    return newExample;
  }

  async updateExample(exampleId, exampleData) {
    const updatedExample = await prisma.user.update({
      where: {
        id: exampleId,
      },
      data: {
        namaLengkap: exampleData.namaLengkap,
        email: exampleData.email,
        passwordHash: await bcrypt.hash(exampleData.password, 10),
      },
    });

    return updatedExample;
  }

  async deleteExample(exampleId) {
    await prisma.user.delete({
      where: {
        id: exampleId,
      },
    });
  }
}

export default new ExampleRepository();
