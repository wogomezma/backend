const productsModel = require("../models/products.models");

class ProductsManager {
  getAllProducts = async () => {
    try {
      const productsArr = await productsModel.find({});
      return productsArr;
    } catch (error) {
      console.log(
        "🚀 ~ file: products.routes.js:42 ~ ProductsRoutes ~ this.router.get ~ error:",
        error
      );
    }
  };

  getProductsById = async (id) => {
    try {
      const productsDetail = await productsModel.findById({ _id: id });

      return productsDetail;
    } catch (error) {
      console.log(
        "🚀 ~ file: products.manager.js:22 ~ ProductsManager ~ getProductsById= ~ error:",
        error
      );
    }
  };

  createProducts = async (bodyProducts) => {
    try {
      // TODO REVISANDO SI EL PRODUCTO YA FUE CREADO ANTERIOMENTE
      const productsDetail = await productsModel.findOne({
        code: bodyProducts.code,
      });
      if (productsDetail && Object.keys(productsDetail).length !== 0) {
        return null;
      }

      const newProducts = await productsModel.create(bodyProducts);
      // TODO: Manejar el error o si pasa algo mientras creo el documento del producto

      return newProducts;
    } catch (error) {
      console.log(
        "🚀 ~ file: products.manager.js:42 ~ ProductsManager ~ createProducts= ~ error:",
        error
      );
    }
  };
}

module.exports = ProductsManager;