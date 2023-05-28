const { Router } = require("express");
const CartsManager = require("../services/carts.service");
const ProductsManager = require("../services/products.service");
const {productsModel} = require("../models/products.model");
const cartsModel = require("../models/carts.model");
const checkAuthJwt = require("../middleware/auth-jwt.middleware")
const rolhMdw = require("../middleware/rol.middleware")
const handlePolicies = require("../middleware/handle-policies.middleware");
const jwt = require('jsonwebtoken');
const { SECRET_JWT } = require("../utils/jwt")


class ViewsRoutes {
  path = "/views";
  router = Router();
  productsManager = new ProductsManager();
  cartsManager = new CartsManager();

  constructor() {
    this.initViewsRoutes();
  }

  initViewsRoutes() {

    this.router.get(`${this.path}/`, async (req, res) => {
      res.render("login");
    });

    this.router.get(`${this.path}/login`, async (req, res) => {
      res.render("login");
    });

    this.router.get(`${this.path}/register`, async (req, res) => {
      res.render("register");
    });
    this.router.get(`${this.path}/profile`, handlePolicies(["user", "admin"]), async (req, res) => {
      const user = req.session.user;
      console.log("🚀 ~ file: views.routes.js:30 ~ ViewsRoutes ~ router.get ~ user:", user)
      res.render("profile", {
        user,
        carrito: { carritoId: '6419fbc078eae46eb1fff5e5', products: [{ pid: '64137403363614f24646475b', nombre: 'Producto de prueba'}]}
      });
    });

    this.router.get(`${this.path}/products`,  handlePolicies(["user", "admin"]), async (req, res) => {
      const { page = 1 , limit= 10} = req.query;
      const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, length, totalPages } =
        await productsModel.paginate({}, { limit: limit, page, lean: true });
        const prevlink = `${this.path}/products?page=${prevPage}&limit=${limit}`
        const nextlink = `${this.path}/products?page=${nextPage}&limit=${limit}`
        const buylink = `${this.path}/products/${this.id}`
        const linkcarts = `${this.path}/carts`
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
        linkcarts,
      });
    });



    this.router.get(`${this.path}/products/:cid/:pid`, handlePolicies(["user", "admin"]), async (req, res) => {
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
  

  this.router.get(`${this.path}/carts`, handlePolicies(["admin"]), async (req, res) => {
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

  this.router.get(`${this.path}/carts/:cartsId`, handlePolicies(["user", "admin"]), async (req, res) => {
    try {
      const id = req.params.cartsId;
      const cartsDetail = await this.cartsManager.getCartsById(id);
      const originalArray = cartsDetail[0].products
      console.log("🚀 ~ file: views.routes.js:131 ~ ViewsRoutes ~ this.router.get ~ originalArray:", originalArray)

      const productsname = originalArray.map(element => {
        return element.product.name;
      });
      const productsquantity = originalArray.map(element => {
        return element.quantity;
      });
      console.log("🚀 ~ file: views.routes.js:138 ~ ViewsRoutes ~ productsquantity ~ productsquantity:", productsquantity)
      console.log("🚀 ~ file: views.routes.js:131 ~ ViewsRoutes ~ this.router.get ~ productsold:", productsname)
      return res.render('cartsid', { productsname, productsquantity });

      } catch (error) {
    console.log(
      "🚀 ~ file: carts.routes.js:43 ~ CartsRoutes ~ this.router.get ~ error:",
      error
    );
  }
});

this.router.get(`${this.path}/recover`, handlePolicies(["public"]), async (req, res) => {
  const token = req.query[Object.keys(req.query)[0]];
  console.log("Token:", token);
  
  try {
    // Decodificar el token para obtener la información
    const decodedToken = jwt.verify(token, SECRET_JWT);
    const { user } = decodedToken;
    const { email } = user;

    // Renderizar la plantilla "recover" y pasar el correo electrónico como variable
    res.render("recover", { email, token });
  } catch (error) {
    // Manejar el error si el token es inválido o ha expirado
    console.log("Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.render("sendrecovery");
    }
    res.status(400).json({ message: "Invalid or expired token" });
  }
});




this.router.get(`${this.path}/sendrecovery`, handlePolicies(["public"]), async (req, res) => {
    
  try {
   res.render("sendrecovery");
  } catch (error) {
    // Manejar el error si el token es inválido o ha expirado
    console.log("Error:", error);
    res.status(400).json({ message: error.message });
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

module.exports = ViewsRoutes, ViewsRoutes.path;