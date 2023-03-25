const mongoose = require("mongoose");

const collection = "users";

const schema = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  password: String,
  rol: String,
});

const userModel = mongoose.model(collection, schema);
module.exports = userModel;