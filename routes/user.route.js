const { Router } = require("express");
const { categoryController } = require("../controllers/category.controller");
const { userController } = require("../controllers/user.controller");
const { productController } = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const route = Router();

route.get("/category", categoryController.getCategory);
route.get("/products", productController.getProducts);
route.get("/basket", authMiddleware, userController.getBasket);

route.post("/oneUser", authMiddleware, userController.getUser);
route.post("/createUser", userController.addUser);
route.post("/loginUser", userController.userLogin);

route.patch(
  "/addproductinbasket/:id",
  authMiddleware,
  userController.addProductInBasket
);
route.patch(
  "/deleteProductFromBasket/:id",
  authMiddleware,
  userController.deleteProductInBasket
);
route.patch(
  "/removeAmountProductinBasket/:id",
  authMiddleware,
  userController.removeAmountProductinBasket
);
route.patch(
  "/addAmountProductinBasket/:id",
  authMiddleware,
  userController.addAmountProductinBasket
);
route.patch("/cashIn", authMiddleware, userController.addCashIn);

route.patch("/bye", authMiddleware, userController.byeProducts);
route.patch("/clear", authMiddleware, userController.clearBasket);

module.exports = route;
