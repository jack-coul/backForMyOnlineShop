const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.json("Ошибка авторизации");
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer") {
      return res.json("неверный тип токена");
    }

    req.user = await jwt.verify(token, process.env.SECRET_JWT_KEY);
    next();
  } catch (error) {
    res.json("Ошибка авторизации");
  }
};
