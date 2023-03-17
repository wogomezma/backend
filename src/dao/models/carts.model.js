const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


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
cartsSchema.plugin(mongoosePaginate);
const cartsModel = mongoose.model(cartsCollection, cartsSchema);
module.exports = cartsModel;