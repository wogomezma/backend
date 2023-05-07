const { userModel, findUserByEmail } = require('../models/user.model');
const cartsModel = require("../models/carts.model");
const { generateJWT } = require("../utils/jwt");
const { createHashValue, isValidPasswd } = require("../utils/encrypt");

class UserManager {
  constructor() {}

  getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find({});
      console.log("🚀 ~ file: user.service.js:9 ~ UserManager ~ getAllUsers= ~ users:", users)
      return users;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getUserById = async (req, res) => {
    try {
      const user = await userModel.findById({ _id: req.params.userId });
      return user;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };



  createUser = async (req, res) => {
    try {
        console.log("BODY Service****", req.body);
   
        const { name, lastname, email, password, rol="user" } = req.body;
        const pswHashed = await createHashValue(password);
        console.log("🚀 ~ file: user.service.js:31 ~ UserManager ~ createUser= ~ pswHashed:", pswHashed)
        var titlecart = 'Carts of' + email
        var descriptioncart = 'Carts of' + name;
        const newCartsdata = { title: titlecart, description: descriptioncart, category: "CartsUser"};
        const newCarts = await cartsModel.create(newCartsdata);
        const userAdd = { name, lastname, email, password: pswHashed, rol, carts: newCarts._id };
        console.log("🚀 ~ file: user.service.js:42 ~ UserManager ~ createUser= ~ newCarts:", newCarts)
        const newUser = await userModel.create(userAdd);
        console.log("🚀 ~ file: user.service.js:35 ~ UserManager ~ createUser= ~ newUser:", newUser)
        req.session.user = { email, name, lastname, rol };
        return newUser;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
        const deleteUserById = await userModel.deleteOne({ _id: req.params.userId });
        return deleteUserById;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

updateUser = async (req, res) => {
    try {
      const { name, lastname, password } = req.body;
  
      const hashedPassword = await createHashValue(password);
  
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.userId,
        { $set: { name, lastname, password: hashedPassword } },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        throw new Error("User not found");
      }
  
      return updatedUser;
    } catch (error) {
      console.log(
        "🚀 ~ file: users.manager.js ~ UsersManager ~ updateUser= ~ error:",
        error
      );
    }
  };
  
  
module.exports = UserManager;