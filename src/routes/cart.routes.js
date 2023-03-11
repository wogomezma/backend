const { Router } = require("express");
const cartsModel = require("../dao/models/carts.model");
const CartsManager = require("../dao/managers/carts.manager");

class CartsRoutes {
  path = "/carts";
  router = Router();
  cartsManager = new CartsManager();

  constructor() {
    this.initCartsRoutes();
  }

  initCartsRoutes() {
    this.router.get(`${this.path}`, async (req, res) => {
      try {
        const allCarts = await this.courseManager.getAllCarts();

        return res.json({
          message: `get all the carts availables`,
          carts: allCarts,
          amountOfCarts: allCarts.lenght,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: carts.routes.js:25 ~ CartsRoutes ~ this.router.get ~ error:",
          error
        );
      }
    });

    this.router.get(`${this.path}/:cartsId`, async (req, res) => {
      try {
        const id = req.params.courseId;
        const cartsDetail = await this.cartsManager.getCartsById(id);
        // TODO: Agregar validacion

        return res.json({
          message: `carts details successfully`,
          carts: cartsDetail,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: carts.routes.js:43 ~ CartsRoutes ~ this.router.get ~ error:",
          error
        );
      }
    });

    this.router.post(`${this.path}`, async (req, res) => {
      try {
        const cartsBody = req.body;
        const newCarts = await this.cartsManager.createCarts(cartsBody);
        // TODO AGREGAR VALIDACIONES
        if (!newCarts) {
          return res.json({
            message: `this carts ${cartsBody.title} is already created`,
          });
        }

        return res.json({
          message: `the carts is created succesfully`,
          carts: newCarts,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: carts.routes.js:43 ~ CartsRoutes ~ this.router.post ~ error:",
          error
        );
      }
    });

    this.router.put(`${this.path}/:cartsId`, async (req, res) => {
      const cartssBody = req.body;
      const { cartsId } = req.params;
      // TODP: AGREGAR VALIDACIONES SOBRE EL BODY Y EL CARTS ID
      const updatedCarts = await cartsModel.updateOne(
        { _id: cartsId },
        cartsBody
      );
      console.log(
        "🚀 ~ file: carts.routes.js:70 ~ CartsRoutes ~ this.router.put ~ updatedCarts:",
        updatedCarts
      );

      // TODO: VALIDACION SI HAY PROBLEMAS ACTUALIZANDO

      return res.json({
        message: `course ${cartsId} updated succesfully`,
        carts: updatedCarts,
      });
    });
  }
}

module.exports = CartsRoutes;