const CartsManager = require("../services/carts.service");
const cartsModel= require('../models/carts.model');

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