const { userModel } = require("../models/user.model");
const { productsModel } = require("../models/products.model");
const cartsModel = require("../models/carts.model");

class ViewsService {
  async getUserById(userId) {
    return await userModel.findById(userId);
  }

  async getProducts(page, limit) {
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, length, totalPages } =
      await productsModel.paginate({}, { limit, page, lean: true });
    return { docs, hasPrevPage, hasNextPage, nextPage, prevPage, length, totalPages, limit, page };
  }

  async getCartById(cartId) {
    return await cartsModel.findById(cartId).populate("products.product").lean();
  }
}

module.exports = ViewsService;
