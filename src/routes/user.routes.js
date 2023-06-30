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
    this.router.get(`${this.path}/`, handlePolicies(["public"]), userCtrl.getAllUsers);
    this.router.get(`${this.path}/:userId`, handlePolicies(["public"]), userCtrl.getUserById);
    this.router.post(`${this.path}/`, handlePolicies(["public"]), userCtrl.createUser);
    this.router.delete(`${this.path}/:userId`, handlePolicies(["public"]), userCtrl.deleteUser);
    this.router.put(`${this.path}/:userId`, handlePolicies(["public"]), userCtrl.updateUser);
    this.router.post(`${this.path}/premium/:userId`, handlePolicies(["public"]), userCtrl.changeToPremium);
    this.router.post(`${this.path}/:uid/documents`, handlePolicies(["public"]), userCtrl.uploadDocuments);
  }
}

module.exports = usersRoutes;
