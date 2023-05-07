const ticketModel = require('../models/ticket.model');


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
        console.log("BODY Service****", req.body);
    
        const { amount, purchaser, products } = req.body;
    
        const ticketAdd = { amount, purchaser, products };
        const newTicket = await ticketModel.create(ticketAdd);
        console.log("🚀 ~ file: tickets.service.js:41 ~ TicketManager ~ createTickets= ~ newTicket:", newTicket)
    
        return newTicket;
    
      } catch (error) {
        console.log(
          "🚀 ~ file: tickets.service.js:47 ~ TicketManager ~ createTickets= ~ error:",
          error
        );
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