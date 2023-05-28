const { Router } = require("express");
const handlePolicies = require("../middleware/handle-policies.middleware");
const userModel = require("../models/user.model");
const CartsManager = require("../services/carts.service");
const UserCtrl = require("../controllers/user.controller");

const router = Router();
const userCtrl = new UserCtrl();

class usersRoutes {
    path = "/users";
    router = Router();
    cartsManager = new CartsManager();
    
    constructor() {
      this.initusersRoutes();
    }
  
    initusersRoutes() {
  
                
        this.router.get(`${this.path}/`, handlePolicies(["admin","premium"]), userCtrl.getAllUsers);
          
          this.router.get(`${this.path}/:userId`, handlePolicies(["admin","premium"]), userCtrl.getUserById);
          
          this.router.post(`${this.path}/`, handlePolicies(["public"]), userCtrl.createUser);

          this.router.delete(`${this.path}/:userId`, handlePolicies(["admin","premium"]), userCtrl.deleteUser);

          this.router.put(`${this.path}/:userId`, handlePolicies(["user","admin","premium"]), userCtrl.updateUser);

          this.router.post(`${this.path}/premium/:userId`, handlePolicies(["admin","premium"]), userCtrl.changeToPremium);

          // this.router.delete(`${this.path}/:userId`, handlePolicies(["admin"]), async (req, res) => {
          //   const deleteUser = await userModel.deleteOne({ _id: req.params.userId });
          //   return res.json({
          //     message: `deleteUserById with ROLE ADMIN`,
          //     user: deleteUser,
          //   });
          // });

  }
}




module.exports = usersRoutes;