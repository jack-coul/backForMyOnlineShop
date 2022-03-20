const User = require("../models/User.model");
const Basket = require("../models/Basket.model");
const Product = require("../models/Product.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.userController = {
  getUser: async (req, res) => {
    try {
      const user = await User.findOne({ login: req.user.login });
      res.json(user);
    } catch (error) {
      res.json(error.toString());
    }
  },
  addUser: async (req, res) => {
    try {
      const { login, password, cash } = req.body;

      const candidate = await User.findOne({ login });

      if (candidate) {
        return res.json("Такой логин уже существует");
      }
      const hashPass = await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_ROUNDS)
      );
      const role = login === "admin" ? "admin" : "user";
      const addUser = await User.create({
        login,
        password: hashPass,
        cash,
        role,
      });

      if (addUser.login !== "admin") {
        await Basket.create({
          userId: addUser._id,
        });
      }
      res.json(addUser);
    } catch (error) {
      res.json("Ошибка запроса 2: " + error.toString());
    }
  },

  addCashIn: async (req, res) => {
    try {
      const { login, cash } = req.body;
      const user = await User.findOne({ login });
      const resultCash = Number(user.cash) + Number(cash);
      const userCash = await User.findByIdAndUpdate(user._id, {
        cash: resultCash,
      });
      res.json(resultCash);
    } catch (error) {
      res.json(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json("deleted");
    } catch (error) {
      res.json(error.toString());
    }
  },

  getBasket: async (req, res) => {
    try {
      const getBasket = await Basket.findOne({
        userId: req.user.id,
      });
      res.json(getBasket);
    } catch (error) {
      res.json("error");
    }
  },

  addProductInBasket: async (req, res) => {
    try {
      const getBasket = await Basket.findOne({
        userId: req.user.id.toString(),
      });
      const product = await Product.findById(req.params.id);
      if (getBasket) {
        await Basket.findByIdAndUpdate(getBasket._id, {
          $addToSet: {
            products: {
              id: product._id,
              left: (product.left -= 1),
              price: product.price,
              amount: 1,
            },
          },
        });
      }
      res.json(product);
    } catch (error) {
      res.json(error);
    }
  },

  deleteProductInBasket: async (req, res) => {
    try {
      const getBasket = await Basket.findOne({ userId: req.user.id });
      const product = await Product.findById(req.params.id);
      if (getBasket) {
        await Basket.findByIdAndUpdate(getBasket._id, {
          $pull: { products: { id: product._id } },
        });
      }
      res.json(getBasket);
    } catch (error) {
      res.json("Ошибка удаления");
    }
  },

  byeProducts: async (req, res) => {
    try {
      const basket = await Basket.findOne({ userId: req.user.id }).populate(
        "products"
      );
      await Basket.findByIdAndUpdate(basket._id, {
        products: [],
      });

      const user = await User.findById(req.user.id);

      if (basket) {
        const productsInBasket = basket.products;

        const products = await Product.find();

        products.forEach((product) => {
          const result = productsInBasket.find((productInBasket) => {
            if (product._id.toString() === productInBasket.id.toString()) {
              return productInBasket;
            }
          });

          if (result) {
            product.left -= result.amount;
            user.cash -= product.price * result.amount;
            user.markModified("user.cash");
            user.save();
            product.markModified("product.left");
            product.save();
          }
        });
      }
      res.json("успешно");
    } catch (error) {
      res.json(error);
    }
  },

  clearBasket: async (req, res) => {
    try {
      const basket = await Basket.findOne({ userId: req.user.id });
      await Basket.findByIdAndUpdate(basket._id, {
        products: [],
      });
      res.json("Корзина успешно очищена");
    } catch (error) {
      res.json(error);
    }
  },

  addAmountProductinBasket: async (req, res) => {
    try {
      const getBasket = await Basket.findOne({
        userId: req.user.id,
      });

      getBasket.products.forEach((product) => {
        if (product.id.toString() === req.params.id) {
          if (product.left > 0) {
            product.amount += 1;
            product.left -= 1;
          }
        }
      });
      getBasket.markModified("products");
      getBasket.save();

      return res.json("Успешно");

      res.json("Нет в наличии");
    } catch (error) {
      res.json(error);
    }
  },

  removeAmountProductinBasket: async (req, res) => {
    try {
      const getBasket = await Basket.findOne({
        userId: req.user.id,
      });

      getBasket.products.forEach((product) => {
        if (product.id.toString() === req.params.id) {
          if (product.amount > 1) {
            product.amount -= 1;
            product.left += 1;
          }
        }
      });
      getBasket.markModified("products");
      getBasket.save();
      res.json(getBasket);
    } catch (error) {
      res.json(error);
    }
  },

  userLogin: async (req, res) => {
    try {
      const { login, password } = req.body;
      const candidate = await User.findOne({ login });
      if (!candidate) {
        return res.json({ error: "неверный логин или пароль" });
      }

      const valid = await bcrypt.compare(password, candidate.password);

      if (!valid) {
        return res.json({ error: "неверный логин или пароль" });
      }

      const payload = {
        id: candidate._id.toString(),
        login: candidate.login,
      };

      const token = await jwt.sign(payload, process.env.SECRET_JWT_KEY, {
        expiresIn: "24h",
      });
      res.json({ token });
    } catch (error) {
      res.status(401).json("ошибка авторизации");
    }
  },
};
