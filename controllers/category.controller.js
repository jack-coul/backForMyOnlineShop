const Category = require("../models/Category.model");

module.exports.categoryController = {
  getCategory: async (req, res) => {
    try {
      const getCategory = await Category.find();
      res.json(getCategory);
    } catch (error) {
      res.json("Ошибка запроса: " + error.toString());
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const addCategory = await Category.create({
        name,
      });
      res.json(addCategory);
    } catch (error) {
      res.json("Ошибка добавления: " + error.toString());
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await Category.findByIdAndUpdate(id, {
        name,
      });
      res.json("Категория изменена");
    } catch (error) {
      res.json("Ошибка изменения: " + error.toString());
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      await Category.findByIdAndDelete(id);
      res.json("deleted");
    } catch (error) {
      res.json("Ошибка удаления: " + error.toString());
    }
  },
};
