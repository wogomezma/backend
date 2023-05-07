const CartsManager = require("../services/carts.service");
const cartsModel= require('../models/carts.model');
const EmailRoutes = require("../routes/email.routes");
const { EMAIL, PSW_EMAIL } = require("../config/config");
const Mustache = require("mustache");



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
      const cart = await this.cartsManager.getCartById(req, res);
      if (!cart) {
        res.json({ message: `this cart does not exist` });
      }
      return res.json({ message: `getCartById`, cart });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


  createCart = async (req, res) => {
    try {
        console.log("BODY en Controller ****", req.body);
    
        const newCart = await this.cartsManager.createCart(req);
    
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