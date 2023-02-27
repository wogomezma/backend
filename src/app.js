const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const listproducts = require("./ProductManagerA.json");
const ProductManager = require("./ProductManager")
const productsRoutes  = require("./routes/products.routes");
const cartRoutes  = require("./routes/cart.routes");
const viewsRoute = require("./routes/views.routes");
const path = require("path");


const PORT = 8080

const app = express();

const BASE_PREFIX = "api"

// CONFIGURACION DE HANDELBARS
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use("/", viewsRoute);

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = new Server(server);


const logs = [];
io.on("connection", (socket) => {
  console.log("a new client is Connected");


 socket.on("messageBySocket", (data) => {
    console.log("data:", data);
    logs.push({ socketid: `${socket.id}-`, message: data });
    io.emit("log", { logs });
  });  

  socket.broadcast.emit(
    "messageForEveryone",
  );

  io.emit("messageAll", "SALUDOS DESDE EL BACKEND");
});

// /api/users --> userRoutes
app.use(`/${BASE_PREFIX}/products`, productsRoutes);
app.use(`/${BASE_PREFIX}/cart`, cartRoutes);

app.get(`/${BASE_PREFIX}/alive`, (req, res) => {
  res.json({ message: `Hola hiciste tu 1ra api, y esta ejecutandose` });
});


/* app.listen(PORT, () => {
    console.log(`APP por el Puerto ${PORT}`);
  });
 */

  