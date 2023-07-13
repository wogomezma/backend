const { Router } = require("express");
const { find } = require("../models/user.model");
const { userModel, findUserByEmail } = require('../models/user.model');
const CartsManager = require("../services/carts.service");
const {productsModel} = require("../models/products.model");
const cartsModel = require("../models/carts.model");
const passport = require("passport");
const { createHashValue, isValidPasswd } = require("../utils/encrypt");
const ROLES = require("../constantes/roles");
const handlePolicies = require("../middleware/handle-policies.middleware");
const { generateJWT } = require("../utils/jwt");
const express = require("express");
const SessionController = require("../controllers/session.controller");

const router = Router();
const sessionController = new SessionController();

class SessionRoutes {
    path = "/session";
    router = Router();
    cartsManager = new CartsManager();

    constructor() {
      this.initSessionRoutes();
    }
  
    initSessionRoutes() {


      this.router.post(`${this.path}/login`, sessionController.login);
      this.router.post(`${this.path}/register`, sessionController.register);

      this.router.get(`${this.path}/current`, handlePolicies(["public"]), sessionController.getCurrentSession);
      this.router.get(`${this.path}/current/admin`, handlePolicies(["admin"]), sessionController.getCurrentAdminSession);
      this.router.get(`${this.path}/current/user`, handlePolicies(["user", "admin", "premium"]), sessionController.getCurrentUserSession);
      this.router.get(`${this.path}/logout`, sessionController.logout);
      this.router.post(`${this.path}/update`, sessionController.update);
      this.router.get(`${this.path}/github`, sessionController.githubAuth);
      this.router.get(`${this.path}/github/callback`, passport.authenticate("github", { failureRedirect: "/login" }), sessionController.githubCallback);

   
  }
}

module.exports = SessionRoutes;