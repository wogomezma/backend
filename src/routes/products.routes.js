const { Router } = require("express");

const productsModel = require("../models/products.model");
const handlePolicies = require("../middleware/handle-policies.middleware");
const productsData = require("../db/products");
const ProductsManager = require("../services/products.service");
const { all } = require("./realtimep.routes");
const ProductCtrl = require("../controllers/product.controller");


const productCtrl = new ProductCtrl();


class ProductsRoutes {
  path = "/products";
  router = Router();
  productsManager = new ProductsManager();

  constructor() {
    this.initProductsRoutes();
  }

  initProductsRoutes() {

    this.router.get(`${this.path}/`, handlePolicies(["public"]), productCtrl.getAllProducts);

    this.router.get(`${this.path}/:productsId`, handlePolicies(["user","admin","premium"]), productCtrl.getProductsById);

    this.router.post(`${this.path}/`, handlePolicies(["premium","admin"]), productCtrl.createProducts);

    this.router.delete(`${this.path}/:productsId`, handlePolicies(["premium","admin"]), productCtrl.deleteProducts);

    this.router.put(`${this.path}/:productsId`, handlePolicies(["admin","premium"]), productCtrl.updateProducts);



  }
}

module.exports = ProductsRoutes;