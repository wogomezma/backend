const UserManager = require("../services/user.service");
const UsersMenManager = require("../services/user-men.service");
const { userModel, findUserByEmail } = require('../models/user.model');

class UserCtrl {
    userManager;
  constructor() {
    this.userManager = new UserManager();
    // SW a Memoria
    // this.userManager = new UsersMenManager();
  }

  getAllUsers = async (req, res) => {
    try {
      const users = await this.userManager.getAllUsers(req, res);
      console.log("🚀 ~ file: user.controller.js:15 ~ UserCtrl ~ getAllUsers= ~ users:", users)
      return res.json({ message: `getAllUsers`, users });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getUserById = async (req, res) => {
    try {
      const user = await this.userManager.getUserById(req, res);
      if (!user) {
        res.json({ message: `this users does not exist` });
      }
      return res.json({ message: `getUserById`, user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


  createUser = async (req, res) => {
    try {
        console.log("BODY en Controller ****", req.body);
        const useremail = req.body.email;
        const existingUser = await findUserByEmail(useremail);
    
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
    
        const newUser = await this.userManager.createUser(req);
    
        if (!newUser) {
          return res.status(500).json({ message: "User creation failed" });
        }
    
        return res.status(201).json({
          message: `User created`,
          user: newUser,
        });
          
      } catch (error) {
        return res.status(500).json({ messagecreate: error.message });
      }
  };

  deleteUser = async (req, res) => {
    try {
        const deleteUserById = await this.userManager.deleteUser(req, res);
        if (!deleteUserById) {
          res.json({ message: `this users does not exist` });
        }
        return res.json({
            message: `deleteUserById with ROLE ADMIN`,
            user: deleteUserById,
          });
      } catch (error) {
        return res.status(500).json({ messagedelete: error.message });
      }
  };


  updateUser = async (req, res) => {
    try {
      const updatedUser = await this.userManager.updateUser(req, res);
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({ messageupdateuser: error.message });
    }
  };
  


}

module.exports = UserCtrl;