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

    this.router.get(`${this.path}/:cid`, handlePolicies(["public"]), cartCtrl.getCartById);

    this.router.post(`${this.path}/`, handlePolicies(["user"]), cartCtrl.createCart);

    this.router.delete(`${this.path}/:cid`, handlePolicies(["user"]), cartCtrl.deleteCart);

    this.router.put(`${this.path}/:cid`, handlePolicies(["user"]), cartCtrl.updateCart);

    this.router.post(`${this.path}/:cid/purchase`, handlePolicies(["user"]), cartCtrl.purchaseCart);


    

    // this.router.get(`${this.path}`, async (req, res) => {
      
    //   const { page = 1, limit = 10 } = req.query;

      
    //   const {
    //     docs,
    //     totalDocs,
    //     limit: limitPag,
    //     totalPages,
    //     hasPrevPage,
    //     hasNextPage,
    //     nextPage,
    //     prevPage,
    //   } = await cartsModel.paginate({}, { page, limit });
    //   const prevlink = `${this.path}?page=${prevPage}&limit${limit}`
    //   const nextlink = `${this.path}?page=${nextPage}&limit${limit}`
   
    //   res.json({
    //     status: `get all Carts`,
    //     payload: docs,
    //     length: totalDocs,
    //     limit: limitPag,
    //     page,
    //     totalPages,
    //     hasNextPage,
    //     nextPage,
    //     hasPrevPage,
    //     prevPage,
    //     prevlink,
    //     nextlink,
    //   });
    // });
    

    // this.router.get(`${this.path}/:cartsId`, async (req, res) => {
    //   try {
    //     const id = req.params.cartsId;
    //     const cartsDetail = await this.cartsManager.getCartsById(id);
        

    //     return res.json({
    //       message: `carts details successfully`,
    //       carts: cartsDetail,
    //     });
    //   } catch (error) {
    //     console.log(
    //       "🚀 ~ file: carts.routes.js:43 ~ CartsRoutes ~ this.router.get ~ error:",
    //       error
    //     );
    //   }
    // });

    // this.router.post(`${this.path}`,  handlePolicies(["user", "admin"]), async (req, res) => {
    //   try {
    //     const cartsBody = req.body;
    //     const newCarts = await this.cartsManager.createCarts(cartsBody);
    //     console.log("🚀 ~ file: cart.routes.js:77 ~ CartsRoutes ~ this.router.post ~ newCarts:", newCarts)
    //     console.log("🚀 ~ file: cart.routes.js:82 ~ CartsRoutes ~ this.router.post ~ req.user:", req.user)
    //     const {
    //       user: { id },
    //     } = req.user;
      

    //     const userData = await userModel.findById({ _id: id });
    //     console.log("🚀 ~ file: cart.routes.js:84 ~ CartsRoutes ~ this.router.post ~ userData:", userData)

    //     userData.carts.push({ cart: newCarts._id });
    //     console.log("🚀 ~ file: cart.routes.js:88 ~ CartsRoutes ~ this.router.post ~ userData:", userData)

    //     const updatedCarts = await userModel.updateOne({ _id: id }, userData);
    //     console.log("🚀 ~ file: cart.routes.js:91 ~ CartsRoutes ~ this.router.post ~ updatedCarts:", updatedCarts)

    //     if (!updatedCarts.acknowledged) {
    //       return res.status(500).json({
    //         message: `note has been created but can not be related`,
    //       });
    //     }

    //     if (!newCarts) {
    //       return res.json({
    //         message: `this carts ${cartsBody.title} is already created`,
    //       });
    //     }
        

    //     return res.json({
    //       message: `the carts is created succesfully`,
    //       carts: newCarts,
    //       userupdatecart: userData,
    //     });
    //   } catch (error) {
    //     console.log(
    //       "🚀 ~ file: carts.routes.js:101 ~ CartsRoutes ~ this.router.post ~ error:",
    //       error
    //     );
    //   }
    // });

    // this.router.put(`${this.path}/:cid`,  handlePolicies(["user", "admin"]), async (req, res) => {
    //   try {
    //     const { cid } = req.params;
    //     const { pid , quantity } = req.query
    //     console.log("🚀 ~ file: cart.routes.js:114 ~ CartsRoutes ~ this.router.post ~ cid:", cid, "and", pid, "and", quantity)

    //     const addproductincart = await this.cartsManager.CartsAgregateAll(cid,pid, Number(quantity));
        
    //     if (!addproductincart) {
    //       return res.json({
    //         message: `this carts ${addproductincart} is already created`,
    //       });
    //     }

    //     return res.json({
    //       message: `the product is add in carts`,
    //       carts: addproductincart,
    //       cartsid: cid,
    //     });
    //   } catch (error) {
    //     console.log(
    //       "🚀 ~ file: carts.routes.js:129 ~ CartsRoutes ~ this.router.post ~ error:",
    //       error
    //     );
    //   }
    // });


    // this.router.put(`${this.path}/:cid/products/:pid`,  handlePolicies(["user", "admin"]), async (req, res) => {
    //   try {
    //     const {quantity=1} = req.body;
    //     const { cid  , pid } = req.params;
    //     console.log("🚀 ~ file: cart.routes.js:114 ~ CartsRoutes ~ this.router.post ~ pid:", pid)
    //     console.log("🚀 ~ file: cart.routes.js:114 ~ CartsRoutes ~ this.router.post ~ cid:", cid)
    //     console.log("🚀 ~ file: cart.routes.js:142 ~ CartsRoutes ~ this.router.put ~ quantity:", quantity)

    //     const addproductincart = await this.cartsManager.CartsAgregateOne(cid, pid, Number(quantity));
        
    //     if (!addproductincart) {
    //       return res.json({
    //         message: `this carts ${addproductincart} is already created`,
    //       });
    //     }

    //     return res.json({
    //       message: `the product is add in carts`,
    //       carts: addproductincart,
    //       cartsid: cid,
    //       productsid: pid,
    //       quantity: quantity
    //     });
    //   } catch (error) {
    //     console.log(
    //       "🚀 ~ file: carts.routes.js:129 ~ CartsRoutes ~ this.router.post ~ error:",
    //       error
    //     );
    //   }
    // });

    // this.router.post(`${this.path}/:cid/products/:pid`,  handlePolicies(["user", "admin"]), async (req, res) => {
    //   try {
    //     const cartsBody = req.body;
    //     const { cid  , pid } = req.params;
    //     console.log("🚀 ~ file: cart.routes.js:114 ~ CartsRoutes ~ this.router.post ~ pid:", pid)
    //     console.log("🚀 ~ file: cart.routes.js:114 ~ CartsRoutes ~ this.router.post ~ cid:", cid)

    //     const addproductincart = await this.cartsManager.CartsAgregate(cid, pid);
        
    //     if (!addproductincart) {
    //       return res.json({
    //         message: `this carts ${addproductincart} is already created`,
    //       });
    //     }

    //     return res.json({
    //       message: `the product is add in carts`,
    //       carts: addproductincart,
    //       cartsid: cid,
    //       productsid: pid,
    //       linkProducts: "/api/v1/views/products",
    //       linkCarrito: `/api/v1/carts/${cid}`,
    //     });

  

    //   } catch (error) {
    //     console.log(
    //       "🚀 ~ file: carts.routes.js:129 ~ CartsRoutes ~ this.router.post ~ error:",
    //       error
    //     );
    //   }
    // });

    

    // this.router.delete(`${this.path}/:cid`,  handlePolicies(["user", "admin"]), async (req, res) => {
    //   try {
    //     const cartsBody = req.body;
    //     const { cid } = req.params;
    //     console.log("🚀 ~ file: cart.routes.js:144 ~ CartsRoutes ~ this.router.post ~ cartsid:", cid)

    //     const delproducts = await this.cartsManager.CartsDelAllProducts(cid);
        
    //     if (!delproducts) {
    //       return res.json({
    //         message: `this carts ${delproducts} is del products`,
    //       });
    //     }

    //     return res.json({
    //       message: `the product is add in carts`,
    //       carts: delproducts,
    //       cartsid: cid,
    //     });
    //   } catch (error) {
    //     console.log(
    //       "🚀 ~ file: carts.routes.js:129 ~ CartsRoutes ~ this.router.post ~ error:",
    //       error
    //     );
    //   }
    // });


    // this.router.delete(`${this.path}/:cid/products/:pid`,  handlePolicies(["user", "admin"]), async (req, res) => {
    //   try {
    //     const cartsBody = req.body;
    //     const { cid, pid } = req.params;
    //     console.log("🚀 ~ file: cart.routes.js:144 ~ CartsRoutes ~ this.router.post ~ cartsid:", cid, "and", pid)

    //     const delproducts = await this.cartsManager.CartsDelAllProducts(cid);
        
    //     if (!delproducts) {
    //       return res.json({
    //         message: `this carts ${delproducts} is del products`,
    //       });
    //     }

    //     return res.json({
    //       message: `the product is add in carts`,
    //       carts: delproducts,
    //       cartsid: cid,
    //       pid: pid,
    //     });
    //   } catch (error) {
    //     console.log(
    //       "🚀 ~ file: carts.routes.js:129 ~ CartsRoutes ~ this.router.post ~ error:",
    //       error
    //     );
    //   }
    // });

  //   this.router.put(`${this.path}/:cartsId`,  handlePolicies(["user", "admin"]), async (req, res) => {
  //     const cartssBody = req.body;
  //     const { cartsId } = req.params;
      
  //     const updatedCarts = await cartsModel.updateOne(
  //       { _id: cartsId },
  //       cartsBody
  //     );
  //     console.log(
  //       "🚀 ~ file: carts.routes.js:70 ~ CartsRoutes ~ this.router.put ~ updatedCarts:",
  //       updatedCarts
  //     );

      

  //     return res.json({
  //       message: `course ${cartsId} updated succesfully`,
  //       carts: updatedCarts,
  //     });
  //   });
   }
}


module.exports = CartsRoutes;