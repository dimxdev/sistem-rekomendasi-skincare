// File di dalam folder controllers fungsinya mengatur request dan response

import exampleService from "../services/example.service.js";

class ExampleController {
  async getAllExamples(req, res) {
    try {
      const examples = await exampleService.getAllExamples();
      res.status(200).json(examples);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async getExampleById(req, res) {
    try {
      const exampleId = req.params.exampleId;
      const example = await exampleService.getExampleById(exampleId);

      res.status(200).json(example);
    } catch (error) {
      res.status(404).json({
        error: error.message,
      });
    }
  }

  async createExample(req, res) {
    try {
      const exampleData = req.body;
      const newExample = await exampleService.createExample(exampleData);

      res.status(201).json({
        message: "user created successfully!",
        data: newExample,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async updateExample(req, res) {
    try {
      const exampleId = req.params.exampleId;
      const exampleData = req.body;
      const updatedExample = await exampleService.updateExample(exampleId, exampleData);

      res.status(200).json({
        message: "user updated successfully!",
        data: updatedExample,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async deleteExample(req, res) {
    try {
      const exampleId = req.params.exampleId;
      await exampleService.deleteExample(exampleId);

      res.status(200).json({
        message: "user deleted successfully!",
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

export default new ExampleController();
