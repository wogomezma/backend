const { Router } = require("express");
const CartsManager = require("../dao/managers/carts.manager");
const ProductsManager = require("../dao/managers/products.managers");

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
      const products = await this.productsManager.getAllProducts();
      const mappedProducts = products.map((pr) => {
        return {
          name: pr.name,
          description: pr.description,
          code: pr.code,
          price: pr.price,
          stock: pr.stock,
          thumbnail: pr.thumbnail,
          carts: pr.carts,
        };
      });
      res.render("products", { products: mappedProducts });
    });

    this.router.get(`${this.path}/chats`, (req, res) => {
      res.render("chat");
    });
  

    this.router.get(`${this.path}/carts`, async (req, res) => {
      const carts = await this.cartsManager.getAllCarts();
      const cartsMapped = carts.map((carts) => {
        return {
          title: carts.title,
          description: carts.description,
          category: carts.category,
        };
      });
      res.render("carts", { carts: cartsMapped });
    });
  }
}


module.exports = ViewsRoutes;