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
    apis: ["./src/docs/**/*.yml"], // Ruta al archivo YAML de productos
  };
  
//   const cartSwaggerOptions = {
//     definition: {
//       openapi: "3.0.0",
//       info: {
//         title: "Documentación del módulo de carrito",
//         version: "1.0.0",
//       },
//     },
//     apis: ["./src/docs/**/*.yml"], // Ruta al archivo YAML de carrito
//   };

const docsSpecs = swaggerJSDoc(DocsSwaggerOptions);
// const cartSpecs = swaggerJSDoc(cartSwaggerOptions);

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

    // this.router.use(`${this.path}/cart`, swaggerUi.serve);
    // this.router.get(`${this.path}/cart`, swaggerUi.setup(cartSpecs));
  }
}

module.exports = DocsRoutes;
