const { Router } = require("express");

const ticketModel = require("../models/ticket.model");
const handlePolicies = require("../middleware/handle-policies.middleware");
const TicketsManager = require("../services/tickets.service");
const { all } = require("./realtimep.routes");
const TicketCtrl = require("../controllers/ticket.controller");


const ticketCtrl = new TicketCtrl();


class ticketsRoutes {
  path = "/tickets";
  router = Router();
  ticketsManager = new TicketsManager();

  constructor() {
    this.initTicketsRoutes();
  }

  initTicketsRoutes() {

    this.router.get(`${this.path}/`, handlePolicies(["admin"]), ticketCtrl.getAllTickets);

    this.router.get(`${this.path}/:ticketId`, handlePolicies(["admin"]), ticketCtrl.getTicketById);

    this.router.post(`${this.path}/`, handlePolicies(["user","premium"]), ticketCtrl.createTickets);

    this.router.delete(`${this.path}/:ticketId`, handlePolicies(["admin"]), ticketCtrl.deleteTicket);

    this.router.put(`${this.path}/:ticketId`, handlePolicies(["admin"]), ticketCtrl.updateTicket);


    }
}

module.exports = ticketsRoutes;