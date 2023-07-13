const { userModel } = require('../models/user.model');
const passport = require("passport");
const { createHashValue, isValidPasswd } = require("../utils/encrypt");
const { generateJWT } = require("../utils/jwt");
const SessionService = require("../services/session.service");

const sessionService = new SessionService();

class SessionController {
  constructor() {
    
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const findUser = req?.user || await userModel.findOne({ email });

      if (!findUser) {
        const error = `este usuario ${email} no está registrado`;
        return res.render("login", { error });
      }

      const isValidComparePsw = await isValidPasswd(password, findUser.password);
      if (!isValidComparePsw) {
        const error = `las credenciales son incorrectas, por favor revísalas ${email}`;
        return res.render("login", { error });
      }

      const signUser = {
        email,
        rol: findUser.rol,
        id: findUser._id,
      };

      const token = await generateJWT({ ...signUser });
      console.log("🚀 ~ file: session.controller.js:37 ~ SessionController ~ login ~ token:", token)

      req.session.user = {
        ...signUser,
      };

      await findUser.login();

      // Llama a la función en session.service.js para guardar el token en la sesión
      sessionService.saveToken(req.session, token);
      localStorage.setItem('token', token);
      

      const { page = 1, limit = 10 } = req.query;
      const products = await sessionService.getProducts(page, limit);
      const prevlink = sessionService.getPrevLink(page, limit);
      const nextlink = sessionService.getNextLink(page, limit);
      const buylink = sessionService.getBuyLink();
      const linkcarts = sessionService.getLinkCarts();

      return res.render("products", {
        uid: req.session?.user?.name || findUser.id,
        name: req.session?.user?.name || findUser.name,
        lastname: req.session?.user?.lastname || findUser.lastname,
        email: req.session?.user?.email || email,
        rol: req.session?.user?.rol || findUser.rol,
        messagesession: `Welcome ${findUser.name} ${findUser.lastname}, your role is ${findUser.rol}`,
        products: products.docs,
        cid: req.session?.user?.cart || findUser.cart,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        length: products.length,
        totalPages: products.totalPages,
        limit: products.limit,
        prevlink,
        nextlink,
        buylink,
        linkcarts,
        token: req.session.token,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.render("login", { error: "An error occurred during login" });
    }
  }

  async register(req, res) {
    try {
      const { name, lastname, email, password, rol = "user" } = req.body;
      const pswHashed = await createHashValue(password);

      const newCarts = await sessionService.createCarts(email, name);
      const newUser = await sessionService.createUser(name, lastname, email, pswHashed, rol, newCarts._id);

      req.session.user = { email, name, lastname, rol };
      return res.render("login");
    } catch (error) {
      console.log("Error:", error);
      return res.render("register", { error: "An error occurred during registration" });
    }
  }

  async getCurrentSession(req, res) {
    console.log("VALIDATING REQ", req.user);
    return res.json({ message: "jwt en los headers" });
  }

  async getCurrentAdminSession(req, res) {
    console.log("VALIDATING REQ", req.user);
    return res.json({ message: "jwt en los headers siendo ADMIN" });
  }

  async getCurrentUserSession(req, res) {
    console.log("VALIDATING REQ", req.user);
    return res.json({ message: "jwt en los headers con rol User" });
  }

  async logout(req, res) {
    try {
      const { user } = req.session;
      if (user) {
        const findUser = await userModel.findById(user.id);
        if (findUser) {
          await findUser.logout();
        }
      }

      // Borrar el token de la sesión
      sessionService.clearToken(req.session);
      localStorage.removeItem('token');

      req.session.destroy((err) => {
        if (!err) {
          return res.redirect("/api/v1/views/login");
        }
        return res.send({ message: `logout Error`, body: err });
      });
    } catch (error) {
      console.log("Error:", error);
      return res.send({ message: "An error occurred during logout", error });
    }
  }

  update = async (req, res) => {
    try {
      console.log("BODY UPDATE****", req.body);
      const { new_password, email } = req.body;

      const newPswHashed = await createHashValue(new_password);
      const user = await userModel.findOne({ email });
      console.log("🚀 ~ file: session.controller.js ~ update ~ user:", user);

      const updateUser = await userModel.findByIdAndUpdate(user._id, {
        password: newPswHashed,
      });
      console.log("🚀 ~ file: session.controller.js ~ update ~ updateUser:", updateUser);

      if (!updateUser) {
        res.json({ message: "problemas actualizando la contraseña" });
      }

      return res.render(`login`);
    } catch (error) {
      console.log("🚀 ~ file: session.controller.js ~ update ~ error:", error);
    }
  };

  githubAuth = passport.authenticate("github", { scope: ["user:email"] });

  githubCallback = async (req, res) => {
    try {
      req.session.user = req.user;
      console.log("🚀 ~ file: session.controller.js ~ githubCallback ~ req.session.user:", req.session.user);
      const { page = 1, limit = 10 } = req.query;
      const products = await sessionService.getProducts(page, limit);
      const prevlink = sessionService.getPrevLink(page, limit);
      const nextlink = sessionService.getNextLink(page, limit);
      const buylink = sessionService.getBuyLink();
      const linkcarts = sessionService.getLinkCarts();
      return res.render("products", {
        name: req.session.user,
        products: products.docs,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        length: products.length,
        totalPages: products.totalPages,
        limit: products.limit,
        prevlink,
        nextlink,
        buylink,
        linkcarts,
      });
    } catch (error) {
      console.log("🚀 ~ file: session.controller.js ~ githubCallback ~ error:", error);
    }
  };
}

module.exports = SessionController;
