const chai = require('chai');
const expect = chai.expect;
const supertest = require("supertest");
const express = require("express");
const CartsRoutes = require("../routes/cart.routes");

const requester = supertest(`http://localhost:8080/api/v1/carts`)


describe("Carts Router", () => {
  let app;
  let request;

  before(() => {
    app = express();
    app.use(express.json());

    const cartsRoutes = new CartsRoutes();
    app.use(cartsRoutes.path, cartsRoutes.router);

    request = supertest(app);
  });

  describe("GET /api/v1/carts", () => {
    it("should return all carts", async () => {
      const response = await requester.get("/");
      expect(response.status).to.equal(200);
      expect(response.body.carts).to.be.an("array");
    });
  });

  describe("GET /api/v1/carts/:cid", () => {
    it("should return a cart by its ID", async () => {
      const cid = "640d295253f2561f45d7afa0";
      const response = await requester.get(`/${cid}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
    });
  
    describe("GET :cid not found", () => {
      it("should return an error if the cart ID does not exist", async () => {
        const cid = "643d5e28eca2dd0f0b495224";
        const response = await requester.get(`/${cid}`); 
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal(`Cart not found with ID: ${cid}`);
      });
    });
  });
  

  

});

