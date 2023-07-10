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

    this.router.get(`${this.path}/`, handlePolicies(["public"]), ticketCtrl.getAllTickets);

    this.router.get(`${this.path}/:ticketId`, handlePolicies(["public"]), ticketCtrl.getTicketById);

    this.router.post(`${this.path}/`, handlePolicies(["public"]), ticketCtrl.createTickets);

    this.router.delete(`${this.path}/:ticketId`, handlePolicies(["public"]), ticketCtrl.deleteTicket);

    this.router.put(`${this.path}/:ticketId`, handlePolicies(["public"]), ticketCtrl.updateTicket);


    }
}

module.exports = ticketsRoutes;