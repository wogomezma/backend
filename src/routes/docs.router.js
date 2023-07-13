const { Router } = require("express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const DocsSwaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Documentación del módulo de productos",
        version: "1.0.0",
      },
    },
    apis: ["./src/docs/**/*.yml"], 
  };
  

const docsSpecs = swaggerJSDoc(DocsSwaggerOptions);

class DocsRoutes {
  path = "/docs";
  router = Router();

  constructor() {
    this.initDocsRoutes();
  }

  initDocsRoutes() {
    this.router.use(`${this.path}/`, swaggerUi.serve);
    this.router.get(
      `${this.path}/`,
      swaggerUi.setup(docsSpecs)
    );

  }
}

module.exports = DocsRoutes;
