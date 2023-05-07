const TicketManager = require("../services/tickets.service");
const ticketModel = require('../models/ticket.model');

class TicketCtrl {
    ticketManager;
  constructor() {
    this.ticketManager = new TicketManager();
  }

  getAllTickets = async (req, res) => {
    try {
      const tickets = await this.ticketManager.getAllTickets(req, res);
        console.log("🚀 ~ file: ticket.controller.js:15 ~ TicketCtrl ~ getAllUsers= ~ tickets:", tickets)
      return res.json({ message: `getAllUsers`, tickets });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getTicketById = async (req, res) => {
    try {
      const ticket = await this.ticketManager.getTicketById(req, res);
      if (!ticket) {
        res.json({ message: `this ticket does not exist` });
      }
      return res.json({ message: `getTicketById`, ticket });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


  createTickets = async (req, res) => {
    try {
        console.log("BODY en Controller ****", req.body);
           
        const newTicket = await this.ticketManager.createTickets(req);
    
        if (!newTicket) {
          return res.status(500).json({ message: "User creation failed" });
        }
    
        return res.status(201).json({
          message: `Ticket created`,
          user: newTicket,
        });
          
      } catch (error) {
        return res.status(500).json({ messagecreate: error.message });
      }
  };

  deleteTicket = async (req, res) => {
    try {
        const deleteTicketById = await this.ticketManager.deleteTicket(req, res);
        if (!deleteTicketById) {
          res.json({ message: `this ticket does not exist` });
        }
        return res.json({
            message: `deleteTicketById with ROLE ADMIN`,
            idticketdelete: req.params.ticketId,
            ticket: deleteTicketById,
          });
      } catch (error) {
        return res.status(500).json({ messagedelete: error.message });
      }
  };


  updateTicket = async (req, res) => {
    try {
      const updatedTicket = await this.ticketManager.updateTicket(req, res);
  
      if (!updatedTicket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
  
      return res.status(200).json({
        message: "User updated successfully",
        user: updatedTicket,
      });
    } catch (error) {
      return res.status(500).json({ messageupdateticket: error.message });
    }
  };
  


}

module.exports = TicketCtrl;