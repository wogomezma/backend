const chai = require('chai');
const expect = chai.expect;
const supertest = require("supertest");
const express = require("express");
const ProductsRoutes = require("../routes/products.routes");

const requester = supertest(`http://localhost:8080/api/v1/products`)

describe("Products Router", () => {
  let app;
  let request;

  before(() => {
    app = express();
    app.use(express.json());

    const productsRoutes = new ProductsRoutes();
    app.use(productsRoutes.path, productsRoutes.router);

    request = supertest(app);
  });

  describe("GET /api/v1/products", () => {
    it("should return all products", async () => {
      const response = await requester.get("/");
      expect(response.status).to.equal(200);
      expect(response.body.products).to.be.an("array");
    });
  });

  describe("GET /api/v1/products/:productId", () => {
    it("should return a product by its ID", async () => {
      const productId = "64193b899f635a6c29829886"; 
      const response = await requester.get(`/${productId}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object");
    });

    describe("GET :productId no encontrado", () => {
      it("should return an error if the product id does not exist", async () => {
        const productId = "64193b899f635a6c29829887";
        const response = await requester.get(`/${productId}`);
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal(`Product not found with ID: ${productId}`);
      });
    });
    
  });

  describe("POST /", () => {
    it("should create a new product", async () => {
      const newProduct = {
        name: "Ergonómico Madera Silla2222",
        code: "322222",
        price: 195,
        stock: 46,
        thumbnail: "https://loremflickr.com/640/480/food",
        description: "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
        owner: "643d5dc6eca2dd0f0b49521b"
    };

      const response = await requester.post("/").send(newProduct);
      expect(response.status).to.equal(201);
      expect(response.body).to.be.an("object");
    });
  });

  after(() => {
    // Tareas de limpieza después de las pruebas
  });
});
