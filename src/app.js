const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const path = require("path");
const realtimepRoutes = require("./routes/realtimep.routes");
const listproducts = require("./ProductManagerA.json");
const ProductManager = require("./ProductManager")
const productsRoutes  = require("./routes/products.routes");
const cartRoutes  = require("./routes/cart.routes");



const viewsRoute = require("./routes/views.routes");

const PORT = 8080;
const BASE_PREFIX = "api"


const app = express();

// CONFIGURACION DE HANDELBARS
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", viewsRoute);
app.use("/realtimeproducts", realtimepRoutes);


const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = new Server(server);

const logs = [];
io.on("connection", (socket) => {
  console.log("a new client is Connected");
  ProductManager.getProducts()

   var log = ProductManager.products
       
    io.emit("log", log);

  socket.on("messageBySocket", (data) => {
    console.log("🚀 ~ file: app.js:48 ~ socket.on ~ data:", data)

    

    ProductManager.deleteProduct(Number(data))
    ProductManager.getProducts()

   

    var log = ProductManager.products
       
    io.emit("log", log);
  });

  socket.on("messageByaddproduct", (data) => {
    console.log("🚀 ~ file: app.js:63 ~ socket.on ~ data:", data)
  
   ProductManager.getProducts()
  
   const {title,description,price,thumbnail,stock,code} = data;
   ProductManager.addProduct(title,description,price,thumbnail,stock,code)
   var log = ProductManager.products
       
    io.emit("log", log);
  });


  socket.broadcast.emit(
    "messageForEveryone",
    "ESTE MENSAJE SE HACE EN BROADCAST PARA TODOS EXCEPTO AL SOCKET QUE RECIBE"
  );

  io.emit("messageAll", "SALUDOS DESDE EL BACKEND");
});



// /api/users --> userRoutes
app.use(`/${BASE_PREFIX}/products`, productsRoutes);
app.use(`/${BASE_PREFIX}/cart`, cartRoutes);
