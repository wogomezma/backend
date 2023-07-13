const chai = require('chai');
const expect = chai.expect;
const supertest = require("supertest");
const express = require("express");
const SessionRoutes = require("../routes/session.routes");

const requester = supertest(`http://localhost:8080/api/v1/session`);

describe("Session Router", () => {
  let app;
  let request;

  before(() => {
    app = express();
    app.use(express.json());

    const sessionRoutes = new SessionRoutes();
    app.use(sessionRoutes.path, sessionRoutes.router);

    request = supertest(app);
  });

  describe("GET /api/v1/session/logout", () => {
    it("should destroy the session and redirect to login page", async () => {
      const response = await requester.get("/logout");
      expect(response.status).to.equal(302);
      
    });
  });

  describe("POST /api/v1/session/login", () => {
    it("should log in the user and render the products page", async () => {
      const response = await requester.post("/login").send({
        email: "wgomez@wgomez.com",
        password: "cambio11",
      });
      expect(response.status).to.equal(200);
    });

    it("should return an error for invalid credentials", async () => {
      const response = await requester.post("/login").send({
        email: "wgomez@wgomez.com",
        password: "password",
      });
      expect(response.status).to.equal(200);
    });
  });

  describe("POST /api/v1/session/register", () => {
    it("should register a new user and render the login page", async () => {
      const response = await requester.post("/register").send({
        name: "nametest3",
        lastname: "lastnametest3",
        email: "emailtest3@wgomez.com",
        password: "cambio3",
        rol: "user",
      });
      expect(response.status).to.equal(200);
    });
  });

  describe("GET /api/v1/session/current", () => {
    it("should return a message indicating a JWT in the headers", async () => {
      const response = await requester.get("/current");
      expect(response.status).to.equal(200);
    });
  });


  describe("POST /api/v1/session/update", () => {
    it("should update the user's password and render the login page", async () => {
      const response = await requester.post("/update").send({
        new_password: "cambio12",
        email: "wgomez@wgomez.com",
      });
      expect(response.status).to.equal(200);
     });
  });

});

