const ticketModel = require('../models/ticket.model');
const cartsModel = require("../models/carts.model");
const { userModel, findUserByEmail } = require('../models/user.model');

class TicketManager {
    getAllTickets = async (req, res) => {
        try {
          const tickets = await ticketModel.find({});
          console.log("🚀 ~ file: tickets.service.js:8 ~ TicketManager ~ getAllTickets= ~ tickets:", tickets)
          
          return tickets;
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      };
    
  
    getTicketById = async (req, res) => {
      try {
        const ticketDetail = await ticketModel.findById({ _id: req.params.ticketId });
  
        return ticketDetail;
      } catch (error) {
        console.log(
          "🚀 ~ file: tickets.manager.js:22 ~ TicketManager ~ getTicketById= ~ error:",
          error
        );
      }
    };
  
    createTickets = async (req, res) => {
      try {
        const { cid, amount } = req.body;

    
        const cart = await cartsModel.findById(cid).populate('products.product').lean();
        if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
        }
    
        const user = await userModel.findOne({ cart: cid });
        const purchaser = user ? user._id : null;
    
        const products = cart.products.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        }));
    
        const ticketAdd = { amount, purchaser, products };
        const newTicket = await ticketModel.create(ticketAdd);

         // Eliminar los productos del carrito
    await cartsModel.findByIdAndUpdate(cid, { $set: { products: [] } });

        return newTicket;
      } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({ message: 'Error creating ticket' });
      }
    };
    
    
    
    
  
  
    deleteTicket = async (req, res) => {
      try {
          const deleteTicketById = await ticketModel.deleteOne({ _id: req.params.ticketId });
          return deleteTicketById;
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    };
  
    updateTicket = async (req, res) => {
        try {
          const { amount } = req.body;
      
          const updatedTicket = await ticketModel.findByIdAndUpdate(
            req.params.ticketId,
            { $set: { amount } },
            { new: true, runValidators: true }
          );
      
          if (!updatedTicket) {
            throw new Error("Ticket not found");
          }
      
          return updatedTicket;
        } catch (error) {
          console.log(
            "🚀 ~ file: tickets.service.js ~ TicketManager ~ updateTicket= ~ error:",
            error
          );
        }
      };
      
  
  }
  
  module.exports = TicketManager;