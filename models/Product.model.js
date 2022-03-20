const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  oldPrice: Number,

  left: {
    type: Number,
    required: true,
  },

  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
