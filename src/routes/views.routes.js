const { Router } = require("express");
const CartsManager = require("../dao/managers/carts.manager");
const ProductsManager = require("../dao/managers/products.manager");

class ViewsRoutes {
  path = "/views";
  router = Router();
  productsManager = new ProductsManager();
  cartsManager = new CartsManager();

  constructor() {
    this.initViewsRoutes();
  }

  initViewsRoutes() {
    this.router.get(`${this.path}/products`, async (req, res) => {
      // let products = [
      //   { name: "prueba", description: "descripcionPrueba", code: "12345678" },
      // ];
      const products = await this.productsManager.getAllProducts();
      const mappedProducts = products.map((pr) => {
        return {
          name: pr.name,
          description: pr.description,
          dni: pr.code,
        };
      });
      res.render("products", { products: mappedProducts });
    });

    this.router.get(`${this.path}/carts`, async (req, res) => {
      // let carts = [];
      const carts = await this.cartsManager.getAllCarts();
      const cartsMapped = carts.map((carts) => {
        return {
          title: carts.title,
        };
      });
      res.render("carts", { carts: cartsMapped });
    });
  }
}

module.exports = ViewsRoutes;