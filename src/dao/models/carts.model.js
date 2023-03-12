const mongoose = require("mongoose");

const cartsCollection = "Carts";

const cartsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    default: [],
  },
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);
module.exports = cartsModel;