const mongoose = require("mongoose");

const basketSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  products: {
    type: Object,
    default: [],
  },
});

const Basket = mongoose.model("Basket", basketSchema);

module.exports = Basket;
