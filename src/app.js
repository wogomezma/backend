const express = require("express");
const cors = require("cors");
const displayRoutes = require("express-routemap");
const handlebars = require("express-handlebars");
const mongoose = require('mongoose');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const corsConfig = require("./config/cors.config");
const { mongoDBconnection, configConnection } = require("./db/mongo.config");
const { Server } = require("socket.io");
const realtimepRoutes = require("./routes/realtimep.routes");
const listproducts = require("./ProductManagerA.json");
const ProductManager = require("./ProductManager")
const CartsManager = require("./services/carts.service");
const { PORT, NODE_ENV,  PERSISTENCE } = require("./config/config");
const sessionRoutes = require("./routes/session.routes");
const mongoStore = require("connect-mongo");
const authMdw = require("./middleware/auth.middleware");
const passport = require('passport');
const initializePassport = require("./config/passport.config");
const usersRoutes = require("./routes/user.routes");

const API_VERSION = "v1";

class App {
  app;
  env;
  port;
  server;

  constructor(routes) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = Number(PORT) || 8080;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initHandlebars();
  }

  /**
   * getServer
   */
  getServer() {
    return this.app;
  }

  closeServer(done) {
    this.server = this.app.listen(this.port, () => {
      done();
    });
  }

  /**
   * connectToDatabase
   */
  async connectToDatabase() {
      await mongoDBconnection();
  }

  initializeMiddlewares() {
    this.app.use(cors(corsConfig));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use("/static", express.static(`${__dirname}/public`));
    this.app.use(cookieParser());
    this.app.use(
      session({
        store: mongoStore.create({
          mongoUrl: configConnection.url,
          mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
          ttl: 60 * 3600,
        }),
        secret: "secretSession",
        resave: false,
        saveUninitialized: false,
      })
    );
    initializePassport();
    this.app.use(passport.initialize())
  }

  /**
   * initializeRoutes
   */
  initializeRoutes(routes) {
    routes.forEach((route) => {
      this.app.use(`/api/${API_VERSION}`, route.router);
    });
  }

  /**
   * listen
   */
  listen() {
    this.app.listen(this.port, () => {
      displayRoutes(this.app);
      console.log(`=================================`);
      console.log(`======= ENV: ${this.env} =======`);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log(`=================================`);
    });
  }

  initHandlebars() {
    this.app.engine("handlebars", handlebars.engine());
    this.app.set("views", __dirname + "/views");
    this.app.set("view engine", "handlebars");
  }
}


const server = App.listen
const io = new Server(server);




// Configuración de mongoose
const messageSchema = new mongoose.Schema({
  user: String,
  message: String
});
const Message = mongoose.model('messages', messageSchema);


/* const io = new Server(App.server); */

// Conexión con Socket.io
io.on('connection', socket => {
  console.log('Un usuario se ha conectado');

  // Escuchar mensajes del usuario
  socket.on('message', data => {
    console.log(`Nuevo mensaje de ${data.user}: ${data.message}`);

    // Guardar el mensaje en la base de datos
    const message = new Message({
      user: data.user,
      message: data.message
    });
    message.save();

    // Enviar el mensaje a todos los usuarios conectados
    io.emit('message', data);
  });

  // Desconexión del usuario
  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');
  });
});




module.exports = App;