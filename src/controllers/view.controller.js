const ViewsService = require("../services/view.service");
const jwt = require("jsonwebtoken");
const { SECRET_JWT } = require("../utils/jwt");
const { userModel } = require("../models/user.model");

class ViewsController {
  constructor() {
    this.viewsService = new ViewsService();
  }

  getLoginView = (req, res) => {
    res.render("login");
  };

  getRegisterView = (req, res) => {
    res.render("register");
  };

  getProfileView = async (req, res) => {
    const user = req.session.user;
    let imagenprofile = "";
    const currentUser = await this.viewsService.getUserById(user.id);

    const identificationDocument = currentUser.documents.find((document) => /^identification\./.test(document.name));

    if (identificationDocument) {
      imagenprofile = identificationDocument.reference;
    }

    res.render("profile", {
      id: currentUser._id.toString(),
      name: `${currentUser.name} ${currentUser.lastname}`,
      email: currentUser.email,
      rol: currentUser.rol,
      imagenprofile,
    });
  };

  getProductsView = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, length, totalPages } = await this.viewsService.getProducts(
      page,
      limit
    );
    const prevlink = `${req.baseUrl}/products?page=${prevPage}&limit=${limit}`;
    const nextlink = `${req.baseUrl}/products?page=${nextPage}&limit=${limit}`;
    const buylink = `${req.baseUrl}/products/${this.id}`;
    const linkcarts = `${req.baseUrl}/carts`;

    res.render("products", {
      products: docs,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      length,
      totalPages,
      limit,
      prevlink,
      nextlink,
      buylink,
      linkcarts,
    });
  };

  addProductToCart = async (req, res) => {
    try {
      const cartsBody = req.body;
      const { pid, cid } = req.params;

      const addProductInCart = await this.viewsService.CartsManager.CartsAgregate(cid, pid);

      if (!addProductInCart) {
        return res.json({
          message: `this product ${addProductInCart} is already added in cart ${cid}`,
        });
      }

      return res.json({
        message: `the product is added in cart`,
        carts: addProductInCart,
        cartsid: cid,
        productsid: pid,
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  getCartsView = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, length, totalPages } = await cartsModel.paginate(
      {},
      { limit, page, lean: true }
    );
    const prevlink = `${req.baseUrl}/carts?page=${prevPage}&limit=${limit}`;
    const nextlink = `${req.baseUrl}/carts?page=${nextPage}&limit=${limit}`;

    res.render("carts", {
      carts: docs,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      length,
      totalPages,
      limit,
      prevlink,
      nextlink,
    });
  };

  getCartDetailsView = async (req, res) => {
    try {
      const { cartsId } = req.params;
      const cart = await this.viewsService.getCartById(cartsId);

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const products = cart.products.map((item) => {
        const product = item.product;
        const quantity = item.quantity;
        const price = product.price;
        const totalValue = quantity * price;
        return {
          name: product.name,
          quantity,
          price,
          totalValue,
          cid: cartsId,
          pid: product._id.toString(),
        };
      });

      const totalCartValue = products.reduce((total, item) => total + item.totalValue, 0);

      return res.render("cartsid", { products, totalCartValue, cartsId });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getRecoverView = async (req, res) => {
    const token = req.query[Object.keys(req.query)[0]];
    console.log("Token:", token);

    try {
      const decodedToken = jwt.verify(token, SECRET_JWT);
      const { user } = decodedToken;
      const { email } = user;

      res.render("recover", { email, token });
    } catch (error) {
      console.log("Error:", error);
      if (error.name === "TokenExpiredError") {
        return res.render("sendrecovery");
      }
      res.status(400).json({ message: "Invalid or expired token" });
    }
  };

  getDocumentsView = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await userModel.findById(uid);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const documents = user.documents;

      res.render("documents", { documents });
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getUserAdminView = async (req, res) => {
    try {
      const users = await userModel.find({}, "name lastname email rol last_connection");

      const usersData = users.map((user) => {
        return {
          uid: user._id.toString(),
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          rol: user.rol,
          last_connection: user.last_connection,
        };
      });



      return res.render("useradmin", { users: usersData });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getSendRecoveryView = async (req, res) => {
    try {
      res.render("sendrecovery");
    } catch (error) {
      console.log("Error:", error);
      res.status(400).json({ message: error.message });
    }
  };
}

module.exports = ViewsController;
