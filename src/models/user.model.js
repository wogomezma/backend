const mongoose = require("mongoose");

const collection = "users";

const roleType = {
  USER: "user",
  ADMIN: "admin",
  PUBLIC: "public",
  PREMIUM: "premium",
};

const documentSchema = new mongoose.Schema({
  name: String,
  reference: String,
});

const schema = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  password: String,
  rol: {
    type: String,
    enum: Object.values(roleType),
  },
  documents: {
    type: [documentSchema],
    default: [],
  },
  last_connection: {
    type: Date,
    default: null,
  },
});

// schema.pre("find", function () {
//   this.populate("carts");
// });

schema.methods.login = async function () {
  this.last_connection = new Date();
  await this.save();
};

schema.methods.logout = async function () {
  this.last_connection = new Date();
  await this.save();
};

const findUserByEmail = async (email) => {
  console.log("🚀 ~ file: user.model.js:38 ~ findUserByEmail ~ email:", email);
  return await userModel.findOne({ email });
};

const userModel = mongoose.model(collection, schema);
module.exports = {
  userModel,
  findUserByEmail,
};
