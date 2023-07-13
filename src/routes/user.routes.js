const { Router } = require("express");
const handlePolicies = require("../middleware/handle-policies.middleware");
const { userModel, findUserByEmail } = require('../models/user.model');
const CartsManager = require("../services/carts.service");
const UserCtrl = require("../controllers/user.controller");
const upload = require("../middleware/multer");

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
    this.router.get(`${this.path}/`, handlePolicies(["user","admin","premium"]), userCtrl.getAllUsers);
    this.router.get(`${this.path}/:userId`, handlePolicies(["user","admin","premium"]), userCtrl.getUserById);
    this.router.post(`${this.path}/`, handlePolicies(["public"]), userCtrl.createUser);
    this.router.delete(`${this.path}/:userId`, handlePolicies(["admin"]), userCtrl.deleteUser);
    this.router.put(`${this.path}/:userId`, handlePolicies(["user","admin","premium"]), userCtrl.updateUser);
    this.router.post(`${this.path}/premium/:userId`, handlePolicies(["admin"]), userCtrl.changeToPremium);
    this.router.post(`${this.path}/:uid/documents`, handlePolicies(["user","admin","premium"]), userCtrl.uploadDocuments);
    this.router.delete(`${this.path}/`, handlePolicies(["admin"]), userCtrl.deleteInactiveUsers);
  }
}

module.exports = usersRoutes;
