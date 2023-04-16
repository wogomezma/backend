const { Router } = require("express");
const handlePolicies = require("../middleware/handle-policies.middleware");
const userModel = require("../dao/models/user.model");
const CartsManager = require("../dao/managers/carts.manager");

const router = Router();


class usersRoutes {
    path = "/users";
    router = Router();
    cartsManager = new CartsManager();

    constructor() {
      this.initusersRoutes();
    }
  
    initusersRoutes() {
  
                
        this.router.get(`${this.path}/`, handlePolicies(["public"]), async (req, res) => {
            const users = await userModel.find({});
            return res.json({ message: `getAllUsers with PUBLIC ROLE`, users });
          });
          
          this.router.get(`${this.path}/:userId`, handlePolicies(["user", "admin"]), async (req, res) => {
            const userData = await userModel.findById({ _id: req.params.userId });
            return res.json({ message: `getUserById for USER ROLE`, user: userData });
          });
          
          this.router.delete(`${this.path}/:userId`, handlePolicies(["admin"]), async (req, res) => {
            const deleteUser = await userModel.deleteOne({ _id: req.params.userId });
            return res.json({
              message: `deleteUserById with ROLE ADMIN`,
              user: deleteUser,
            });
          });

  }
}




module.exports = usersRoutes;