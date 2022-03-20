const { Router } = require("express");
const importAdmin = require("./admin.route");
const importUser = require("./user.route");

const route = Router();

route.use("/admin", importAdmin);
route.use(importUser);

module.exports = route;
