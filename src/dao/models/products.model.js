const mongoose = require("mongoose");

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  carts: {
    type: Array,
    default: [],
  },
});

const productsModel = mongoose.model(productsCollection, productsSchema);
module.exports = productsModel;