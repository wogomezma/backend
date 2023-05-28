const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
});

productsSchema.plugin(mongoosePaginate);

const findUserByCode = async (code) => {
  console.log("🚀 ~ file: products.model.js:41 ~ findUserByCode ~ code:", code)
  return await productsModel.findOne({ code });
};

const productsModel = mongoose.model(productsCollection, productsSchema);

module.exports = {
  productsModel,
  findUserByCode,
};