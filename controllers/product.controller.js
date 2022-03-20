const Category = require("../models/Category.model");
const Product = require("../models/Product.model");

module.exports.productController = {
  getProducts: async (req, res) => {
    try {
      const allProducts = await Product.find();
      res.json(allProducts);
    } catch (error) {
      res.json("Ошибка запроса: " + error.toString());
    }
  },

  addProduct: async (req, res) => {
    try {
      const { image, category, name, price, oldPrice, left } = req.body;
      const searchCategory = await Category.findOne({
        name: category,
      });
      const addProduct = await Product.create({
        image,
        category,
        name,
        price,
        oldPrice,
        left,
        categoryId: searchCategory._id.toString(),
      });
      res.json(addProduct);
    } catch (error) {
      res.json("Ошибка запроса: " + error.toString());
    }
  },

  editProduct: async (req, res) => {
    try {
      const { image, category, name, price, oldPrice, left } = req.body;
      const searchCategory = await Category.findOne({ category });
      await Product.create({
        image,
        category,
        name,
        price,
        oldPrice,
        left,
        categoryId: searchCategory._id.toString(),
      });
      res.json("Продукт успешно изменен");
    } catch (error) {
      res.json("Ошибка запроса: " + error.toString());
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      await Product.findByIdAndDelete(id);
      res.json("Продукт успешно удален");
    } catch (error) {
      res.json("Ошибка запроса: " + error.toString());
    }
  },
};
