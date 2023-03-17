const { Router } = require("express");
const CartsManager = require("../dao/managers/carts.manager");
const ProductsManager = require("../dao/managers/products.managers");
const productsModel = require("../dao/models/products.model");
const cartsModel = require("../dao/models/carts.model");

class ViewsRoutes {
  path = "/views";
  router = Router();
  productsManager = new ProductsManager();
  cartsManager = new CartsManager();

  constructor() {
    this.initViewsRoutes();
  }

  initViewsRoutes() {
/*     this.router.get(`${this.path}/products`, async (req, res) => {
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
    }); */

    this.router.get(`${this.path}/products`, async (req, res) => {
      const { page = 1 , limit= 10} = req.query; // extrae el query param page y sino viene el valor por defecto es 1
      const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, length, totalPages } =
        await productsModel.paginate({}, { limit: limit, page, lean: true });
        const prevlink = `${this.path}/products?page=${prevPage}&limit=${limit}`
        const nextlink = `${this.path}/products?page=${nextPage}&limit=${limit}`
      res.render("products", {
        products: docs,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        length,
        totalPages,
        limit,
        prevlink,
        nextlink,
      });
    });



/*     this.router.get(`${this.path}/chats`, (req, res) => {
      res.render("chat");
    }); */
  

 /*    this.router.get(`${this.path}/carts`, async (req, res) => {
      const carts = await this.cartsManager.getAllCarts();
      const cartsMapped = carts.map((carts) => {
        return {
          title: carts.title,
          description: carts.description,
          category: carts.category,
        };
      });
      res.render("carts", { carts: cartsMapped });
    });*/
  

  this.router.get(`${this.path}/carts`, async (req, res) => {
    const { page = 1 , limit= 10} = req.query; // extrae el query param page y sino viene el valor por defecto es 1
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, length, totalPages } =
      await cartsModel.paginate({}, { limit: limit, page, lean: true });
      const prevlink = `${this.path}/carts?page=${prevPage}&limit=${limit}`
      const nextlink = `${this.path}/carts?page=${nextPage}&limit=${limit}`
    res.render("carts", {
      carts: docs,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      length,
      totalPages,
      limit,
      prevlink,
      nextlink,
    });
  });
  }
}




module.exports = ViewsRoutes;