const { Router } = require("express");
const cartsModel = require("../models/carts.model");
const CartsManager = require("../services/carts.service");
const { body, validationResult } = require('express-validator');
const handlePolicies = require("../middleware/handle-policies.middleware");
const userModel = require("../models/user.model");
const CartCtrl = require("../controllers/cart.controller");

const cartCtrl = new CartCtrl();

class CartsRoutes {
  path = "/carts";
  router = Router();
  cartsManager = new CartsManager();

  constructor() {
    this.initCartsRoutes();
  }

  initCartsRoutes() {


   
    this.router.get(`${this.path}/`, handlePolicies(["public"]), cartCtrl.getAllCarts);

    this.router.get(
      `${this.path}/:cid`,
      handlePolicies(["public"]),
      cartCtrl.getCartById
    );
    

    this.router.post(`${this.path}/`, handlePolicies(["public"]), cartCtrl.createCart);

    this.router.delete(`${this.path}/:cid`, handlePolicies(["public"]), cartCtrl.deleteCart);

    this.router.put(`${this.path}/:cid`, handlePolicies(["public"]), cartCtrl.updateCart);

    this.router.post(`${this.path}/:cid/purchase`, handlePolicies(["public"]), cartCtrl.purchaseCart);


    
   }
}


module.exports = CartsRoutes;