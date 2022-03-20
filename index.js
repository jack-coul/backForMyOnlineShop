require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const importRoute = require("./routes");

const port = 4000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(importRoute);

mongoose
  .connect(
    `mongodb+srv://jackcoul:1558@cluster0.rbezt.mongodb.net/NewProductsShop`
  )
  .then(() => {
    console.log("mongoDB connected");
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  });
