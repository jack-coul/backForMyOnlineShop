const { Router } = require("express");
const { categoryController } = require("../controllers/category.controller");
const { userController } = require("../controllers/user.controller");
const { productController } = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const route = Router();

route.post("/category", authMiddleware, categoryController.addCategory);
route.post("/product", authMiddleware, productController.addProduct);

route.patch("/category/:id", authMiddleware, categoryController.editCategory);
route.patch("/product/:id", authMiddleware, productController.editProduct);

route.delete(
  "/category/:id",
  authMiddleware,
  categoryController.deleteCategory
);
route.delete("/product/:id", authMiddleware, productController.deleteProduct);
route.delete("/user/:id", userController.deleteUser);

module.exports = route;
