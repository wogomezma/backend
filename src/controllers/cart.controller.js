const CartsManager = require("../services/carts.service");
const cartsModel= require('../models/carts.model');
const { productsModel, findUserByCode, } = require('../models/products.model');
const EmailRoutes = require("../routes/email.routes");
const { EMAIL, PSW_EMAIL } = require("../config/config");
const Mustache = require("mustache");
const { EnumErrors, HttpResponses } = require("../middleware/error-handle");

const httpResp = new HttpResponses();


const emailRoutesInstance = new EmailRoutes();



class CartCtrl {
    cartsManager;
  constructor() {
    this.cartsManager = new CartsManager();
  }

  getAllCarts = async (req, res) => {
    try {
      const carts = await this.cartsManager.getAllCarts(req, res);
        console.log("🚀 ~ file: carts.controller.js:15 ~ UserCtrl ~ getAllUsers= ~ users:", carts)
      return res.json({ message: `getAllCarts`, carts });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getCartById = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await this.cartsManager.getCartsById(cartId);
      console.log("🚀 ~ file: cart.controller.js:36 ~ CartCtrl ~ getCartById= ~ cart:", cart)
      
      if (!cart) {
        return res.status(404).json({ error: `Cart not found with ID: ${cartId}` });
      }
      return res.json({ message: `getCartById`, cart });
    } catch (error) {
      return httpResp.Error(
        res,
        `${EnumErrors.DATABASE_ERROR} - ERROR DB ${error}`
      );
    }
  };
  
  

  createCart = async (req, res) => {
    try {
        console.log("BODY en Controller ****", req.body);
    
        const newCart = await this.cartsManager.createCarts(req);
    
        if (!newCart) {
          return res.status(500).json({ message: "Cart creation failed" });
        }
    
        return res.status(201).json({
          message: `Cart created`,
          user: newCart,
        });
          
      } catch (error) {
        return res.status(500).json({ messagecreate: error.message });
      }
  };

  deleteCart = async (req, res) => {
    try {
        const deleteCartById = await this.cartsManager.deleteCart(req, res);
        if (!deleteCartById) {
          res.json({ message: `this Cart does not exist` });
        }
        return res.json({
            message: `deleteCartById with ROLE ADMIN`,
            user: deleteCartById,
          });
      } catch (error) {
        return res.status(500).json({ messagedelete: error.message });
      }
  };


  updateCart = async (req, res) => {
    try {
      const currentUser = req.user;
      const { user } = currentUser;
      const productsDetail = await productsModel.findById({ _id: req.params.cid});
      console.log("🚀 ~ file: product.controller.js:186 ~ ProductCtrl ~ deleteProducts ~ productsDetail:", productsDetail)
      const { owner } = productsDetail;
      const ownerId = owner.toString();

      console.log("🚀 ~ file: products.service.js:190 ~ ProductsManager ~ deleteProduct ~ owner:", ownerId,"and",user.id)
  
      if (user.rol === 'premium') {
        // Si el usuario es premium, validar si es el propietario del producto
        if (ownerId === user.id) {
          return res.status(403).json({ message: "No puedes agregar a tu carrito un producto que te pertenece" });
        }
      }

      const updatedCart = await this.cartsManager.updateCart(req, res);
  
  
      if (!updatedCart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      return res.status(200).json({
        message: "Cart updated successfully",
        Cart: updatedCart,
      });
    } catch (error) {
      return res.status(500).json({ messageupdatecartr: error.message });
    }
  };
  
  purchaseCart = async (req, res) => {
    try {
        console.log("User object in session:", req.session.user);

        

      const result = await this.cartsManager.purchaseCart(req);

      if (!result || !result.updatedCart || !result.newTicket) {
        return res.status(500).json({ message: "Purchase failed" });
      }

      const emailOptions = {
        from: EMAIL,
        to: req.session.user.email,
        subject: "Purchase Confirmation",
        html: `
          <h2>Purchase Confirmation</h2>
          <p>Hi {{name}},</p>
          <p>Your purchase has been completed successfully.</p>
    
          <p>Thank you for shopping with us!</p>
        `
      };
      
      // Render the email template with the purchase data
      const template = Mustache.render(emailOptions.html, {
        name: req.session.user.name,
        items: result.updatedCart && result.updatedCart.items ? result.updatedCart.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })) : [],
        total: result.updatedCart && result.updatedCart.total ? result.updatedCart.total.toFixed(2) : "0.00"
      });
      
      
      // Update the emailOptions with the rendered template
      emailOptions.html = template;
      
      // Send the email
      await emailRoutesInstance.sendEmail(emailOptions);
      

      return res.status(200).json({
        message: `Purchase completed successfully`,
        cart: result.updatedCart,
        ticket: result.newTicket,
        insufficientStockProducts: result.insufficientStockProducts,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

}

module.exports = CartCtrl;