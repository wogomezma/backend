const { Router } = require("express");
const { find } = require("../dao/models/user.model");
const userModel = require("../dao/models/user.model");
const CartsManager = require("../dao/managers/carts.manager");
const productsModel = require("../dao/models/products.model");
const passport = require("passport");
const { createHashValue, isValidPasswd } = require("../utils/encrypt");


const router = Router();


class SessionRoutes {
    path = "/session";
    router = Router();
    cartsManager = new CartsManager();

    constructor() {
      this.initSessionRoutes();
    }
  
    initSessionRoutes() {
  
        this.router.get(`${this.path}/logout`, async (req, res) => {
            req.session.destroy((err) => {
              if (!err) return res.redirect("/api/v1/views/login");
              return res.send({ message: `logout Error`, body: err });
            });
          });
  
        this.router.post(`${this.path}/login`, async (req, res) => {
            try {
              const { email, password } = req.body;
              const session = req.session;
              console.log("🚀 ~ file: session.routes.js:36 ~ SessionRoutes ~ this.router.get ~ session:", session)
              
          
              const findUser = await userModel.findOne({ email });
              console.log("🚀 ~ file: session.routes.js:40 ~ SessionRoutes ~ this.router.get ~ findUser:", findUser)
 
          
              if (!findUser) {
                const error= `este usuario ${email} no esta registrado`
                return res.render("login", {error});
              }
              const isValidComparePsw = await isValidPasswd(password, findUser.password);
              console.log("🚀 ~ file: session.routes.js:46 ~ SessionRoutes ~ this.router.post ~ isValidComparePsw:", isValidComparePsw);

              if (!isValidComparePsw) {
                const error= `las credenciales son erroneas, por favor reviselas ${email}`
                return res.render("login", {error});
              }

/*               if (findUser.password !== password) {
                const error= `password incorrecto para el usuario ${email}`
                return res.render("login", {error});
              } */
          
              req.session.user = {
                ...findUser,
              };

              const { page = 1 , limit= 10} = req.query;
              const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, length, totalPages } =
                await productsModel.paginate({}, { limit: limit, page, lean: true });
                const prevlink = `${this.path}/products?page=${prevPage}&limit=${limit}`
                const nextlink = `${this.path}/products?page=${nextPage}&limit=${limit}`
                const buylink = `${this.path}/products/${this.id}`
                const linkcarts = `${this.path}/carts`
          
              return res.render("products", {
                name: req.session?.user?.name || findUser.name,
                lastname: req.session?.user?.lastname || findUser.lastname,
                email: req.session?.user?.email || email,
                rol: req.session?.user?.rol || findUser.rol,
                messagesession: `Welcome ${findUser.name} ${findUser.lastname} your rol is ${findUser.rol}`,
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
            } catch (error) {
            console.log("🚀 ~ file: session.routes.js:61 ~ SessionRoutes ~ this.router.get ~ error:", error)

            }
          });
          
          this.router.post(`${this.path}/register`, async (req, res) => {
            try {
              console.log("BODY ****", req.body);
              const { name, lastname, email, password, rol="user" } = req.body;
              const pswHashed = await createHashValue(password);
              console.log("🚀 ~ file: session.routes.js:101 ~ SessionRoutes ~ this.router.post ~ pswHashed:", pswHashed)
          
              const userAdd = { name, lastname, email, password: pswHashed, rol };
              const newUser = await userModel.create(userAdd);
              console.log("🚀 ~ file: session.routes.js:73 ~ SessionRoutes ~ this.router.get ~ newUser:", newUser)

          
              req.session.user = { email, name, lastname, rol };
              return res.render("login");
            } catch (error) {
              console.log(
                "🚀 ~ file: session.routes.js:36 ~ router.post ~ error:",
                error
              );
            }
        });

        this.router.post(`${this.path}/update`, async (req, res) => {
          try {
            console.log("BODY UPDATE****", req.body);
            const { new_password, email } = req.body;
        
            const newPswHashed = await createHashValue(new_password);
            const user = await userModel.findOne({ email });
            console.log("🚀 ~ file: session.routes.js:126 ~ SessionRoutes ~ this.router.post ~ user:", user)
        
            const updateUser = await userModel.findByIdAndUpdate(user._id, {
              password: newPswHashed,
            });
            console.log("🚀 ~ file: session.routes.js:131 ~ SessionRoutes ~ this.router.post ~ updateUser:", updateUser)
        
            if (!updateUser) {
              res.json({ message: "problemas actualizando la contrasena" });
            }
        
            return res.render(`login`);
          } catch (error) {
          console.log("🚀 ~ file: session.routes.js:136 ~ SessionRoutes ~ this.router.post ~ error:", error);
          }
        });
        
        this.router.get(
          `${this.path}/github`,
          passport.authenticate("github", { scope: ["user:email"] }),
          async (req, res) => {}
        );
        
        this.router.get(
          `${this.path}/github/callback`,
          passport.authenticate("github", { failureRedirect: "/login" }),
          async (req, res) => {
            try {
              req.session.user = req.user;
              console.log("🚀 ~ file: session.routes.js:155 ~ SessionRoutes ~ req.session.user:", req.session.user)
              const { page = 1 , limit= 10} = req.query;
              const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, length, totalPages } =
                await productsModel.paginate({}, { limit: limit, page, lean: true });
                const prevlink = `${this.path}/products?page=${prevPage}&limit=${limit}`
                const nextlink = `${this.path}/products?page=${nextPage}&limit=${limit}`
                const buylink = `${this.path}/products/${this.id}`
                const linkcarts = `${this.path}/carts`
              return res.render("products", {
                name: req.session.user,
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
            } catch (error) {
              console.log("🚀 ~ file: session.routes.js:115 ~ error:", error);
            }
          }
        );

  }
}

module.exports = SessionRoutes;