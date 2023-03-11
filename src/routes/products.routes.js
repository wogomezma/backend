const { Router } = require("express");

const productsModel = require("../dao/models/products.models");

const productsData = require("../db/products");
const ProductsManager = require("../dao/managers/products.manager");

class ProductsRoutes {
  path = "/products";
  router = Router();
  productsManager = new ProductsManager();

  constructor() {
    this.initProductsRoutes();
  }

  initProductsRoutes() {
    this.router.get(`${this.path}/insertion`, async (req, res) => {
      try {
        const products = await productsModel.insertMany(productsData);
        // TODO: agregar validaciones

        return res.json({
          message: "products insert successfully",
          productsInserted: products,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: products.routes.js:25 ~ ProductsRoutes ~ this.router.get ~ error:",
          error
        );
      }
    });

    this.router.get(`${this.path}`, async (req, res) => {
      try {
        // TODO: agregar validaciones
        const productsArr = await this.productsManager.getAllProducts();
        return res.json({
          message: `get all products succesfully`,
          productsLists: productsArr,
          productsAmount: productsArr.length,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: products.routes.js:44 ~ ProductsRoutes ~ this.router.get ~ error:",
          error
        );
      }
    });

    this.router.get(`${this.path}/:productsId`, async (req, res) => {
      try {
        const { productsId } = req.params;
        const productsDetail = await this.productsManager.getProductsById(
          productsId
        );
        // TODO AGREGAR VALIDACION

        return res.json({
          message: `get products info of ${productsId} succesfully`,
          products: productsDetail,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: products.routes.js:60 ~ ProductsRoutes ~ this.router.get ~ error:",
          error
        );
      }
    });

    this.router.post(`${this.path}`, async (req, res) => {
      try {
        // TODO: HACER VALIDACIONES DEL BODY
        const productsBody = req.body;

        // TODO REVISANDO SI EL ESTUDIANTE YA FUE CREADO ANTERIOMENTE
        const newProducts = await this.productsManager.createProducts(productsBody);
        if (!newProducts) {
          return res.json({
            message: `the products with dni ${ProductsBody.dni} is already register`,
          });
        }

        return res.json({
          message: `products created successfully`,
          products: newProducts,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: products.routes.js:79 ~ ProductsRoutes ~ this.router.post ~ error:",
          error
        );
      }
    });
  }
}

module.exports = ProductsRoutes;