const cartsModel = require("../models/carts.model");

class CartsManager {
  getAllCarts = async () => {
    try {
      const allCarts = await cartsModel.find({});

      return allCarts;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:11 ~ CartsManager ~ getAllCarts=async ~ error:",
        error
      );
    }
  };

  getCourseById = async (id) => {
    try {
      return await cartsModel.findById({ _id: id });
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:21 ~ CartsManager ~ getCartsById= ~ error:",
        error
      );
    }
  };

  createCarts = async (cartsBody) => {
    try {
      const checkCarts = await cartsModel.findOne({
        title: `${cartsBody.title.toLowerCase()}`,
      });

      if (checkCarts) {
        return null;
      }

      const newCarts = await cartsModel.create({
        ...cartsBody,
        title: cartsBody.title.toLowerCase(),
      });

      return newCarts;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:45 ~ CartsManager ~ createCarts=async ~ error:",
        error
      );
    }
  };
}

module.exports = CartsManager;