const mongoose = require("mongoose");

const collection = "users";

const roleType = {
  USER: "user",
  ADMIN: "admin",
  PUBLIC: "public",
};

const schema = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  password: String,
  rol: {
    type: String,
    enum: Object.values(roleType),
  },
  carts: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Carts",
        },
      },
    ],
    default: [],
  },
});

schema.pre("find", function () {
  this.populate("carts.cart");
});

const userModel = mongoose.model(collection, schema);
module.exports = userModel;