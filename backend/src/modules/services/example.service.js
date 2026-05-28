// File di dalam folder services fungsinya untuk business logic

import exampleRepository from "../repositories/example.repository.js";

class ExampleService {
  async getAllExamples() {
    const examples = await exampleRepository.getAllExamples();

    return examples;
  }

  async getExampleById(exampleId) {
    const example = await exampleRepository.getExampleById(exampleId);

    if (!example) {
      throw new Error("Example not found!");
    }

    return example;
  }

  async createExample(exampleData) {
    if (
      !exampleData.namaLengkap ||
      !exampleData.email ||
      !exampleData.password
    ) {
      throw new Error("data yang dimasukkan tidak lengkap!");
    }

    const newExample = await exampleRepository.createExample(exampleData);

    return newExample;
  }

  async updateExample(exampleId, exampleData) {
    await this.getExampleById(exampleId);
    const updatedExample = await exampleRepository.updateExample(
      exampleId,
      exampleData,
    );

    return updatedExample;
  }

    async deleteExample(exampleId) {
        await this.getExampleById(exampleId);
        await exampleRepository.deleteExample(exampleId);
    }
}

export default new ExampleService();
