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
        const buylink = `${this.path}/products/${this.id}`
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
        buylink,
      });
    });

    this.router.get(`${this.path}/products/:cid/:pid`, async (req, res) => {
      try {
        const cartsBody = req.body;
         const {pid,cid} = req.params
        console.log("🚀 ~ file: views.routes.js:59 ~ ViewsRoutes ~ this.router.get ~ pid:", pid)
        console.log("🚀 ~ file: views.routes.js:61 ~ ViewsRoutes ~ this.router.get ~ cid:", cid)


        const addproductincart = await this.CartsManager.CartsAgregate(cid,  pid);
        console.log("🚀 ~ file: views.routes.js:64 ~ ViewsRoutes ~ this.router.post ~ addproductincart:", addproductincart)
        
        if (!addproductincart) {
          return res.json({
            message: `this product ${addproductincart} is already add in carts ${cid}`,
          });
        }

        return res.json({
          message: `the product is add in carts`,
          carts: addproductincart,
          cartsid: cid,
          productsid: pid,
        });
      } catch (error) {
      console.log("🚀 ~ file: views.routes.js:79 ~ ViewsRoutes ~ this.router.post ~ error:", error)

      }
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

  this.router.get(`${this.path}/carts/:cartsId`, async (req, res) => {
    try {
      const id = req.params.cartsId;
      const cartsDetail = await this.cartsManager.getCartsById(id);

      const products2 = cartsDetail

      console.log("🚀 ~ file: views.routes.js:134 ~ ViewsRoutes ~ this.router.get ~ products2:", products2)

      console.log("🚀 ~ file: views.routes.js:130 ~ ViewsRoutes ~ this.router.get ~ cartsDetail:", cartsDetail.products)
      return res.render("carts",{
        message: `carts details successfully`,
        carts: cartsDetail,
        products2: products2,
      }); 

      } catch (error) {
    console.log(
      "🚀 ~ file: carts.routes.js:43 ~ CartsRoutes ~ this.router.get ~ error:",
      error
    );
  }
});



  }
}


/* function addMessage(pid) {

  const cid = "640d295253f2561f45d7afa0"

  const addproductincart = CartsManager.CartsAgregate(cid, pid);
  console.log("🚀 ~ file: views.routes.js:104 ~ addMessage ~ addproductincart:", addproductincart)

  return addproductincart

  }; */

module.exports = ViewsRoutes;