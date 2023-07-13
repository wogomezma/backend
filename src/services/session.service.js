const { userModel } = require('../models/user.model');
const { productsModel } = require("../models/products.model");
const cartsModel = require("../models/carts.model");

class SessionService {
  async saveToken(session, token) {
    // Guardar el token en la sesión
    session.token = token;
  }

  async clearToken(session) {
    // Borrar el token de la sesión
    session.token = null;
  }

  async getProducts(page, limit) {
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, length, totalPages } = await productsModel.paginate(
      {},
      { limit, page, lean: true }
    );
    return { docs, hasPrevPage, hasNextPage, nextPage, prevPage, length, totalPages, limit, page };
  }

  getPrevLink(page, limit) {
    return `/api/v1/session/products?page=${page - 1}&limit=${limit}`;
  }

  getNextLink(page, limit) {
    return `/api/v1/session/products?page=${page + 1}&limit=${limit}`;
  }

  getBuyLink() {
    return `/api/v1/session/products/`;
  }

  getLinkCarts() {
    return `/api/v1/session/carts`;
  }

  async createCarts(email, name) {
    const titlecart = 'Carts of ' + email;
    const descriptioncart = 'Carts of ' + name;
    const newCartsdata = { title: titlecart, description: descriptioncart, category: "CartsUser" };
    return await cartsModel.create(newCartsdata);
  }

  async createUser(name, lastname, email, password, rol, cart) {
    const userAdd = { name, lastname, email, password, rol, cart };
    return await userModel.create(userAdd);
  }
}

module.exports = SessionService;
