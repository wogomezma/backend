const express = require("express");
const listproducts = require("./src/ProductManagerA.json");
const ProductManager = require("./src/ProductManager")
const productsRoutes  = require("./src/routes/products.routes")
const cartRoutes  = require("./src/routes/cart.routes")

const PORT = 8080

const app = express();

const products = ProductManager

const BASE_PREFIX = "api"

/* app.get(`/`, (request, response)=> {
    response.send("Prueba Express")

}) */

app.use(express.json()); // sin esto no podemos ver el req.body
app.use(express.urlencoded({ extended: true })); // sino se agrega no podremos tomar los parametros de la url del request, req.query

app.use("/static", express.static(`${__dirname}/public`));

/* app.get(`/products`, (req, res) => {
    console.log("Query PARAMS", req.query);
    const { limit } = req.query;
  
 
    let listaFiltrada = Object.assign({}, ...Object.entries(listproducts).slice(0, limit)
    .map(([key, prop]) => ({[key]:prop})));

    return res.json({
      ok: true,
      message: `lista de Productos`,
      usuarios: listaFiltrada,
    });
  });


app.get(`/products/:id`, (req, res) => {
    console.log("PARAMS", req.params);
    const id = req.params.id;
  
    if (isNaN(id)) {
      return res.status(400).json({
        ok: true,
        message: `no existe el producto con el id ${id}`,
        queryParams: req.query,
      });
    }
  
    const products = listproducts.find((u) => {
      return u.id === Number(id);
    });
  
    if (!products) {
      return res.json({
        ok: true,
        message: `no existe el producto con el id ${id}`,
        products,
        queryParams: req.query,
      });
    }
  
    return res.json({ ok: true, message: `products id: ${id}`, products });
  }); */

// /api/users --> userRoutes
app.use(`/${BASE_PREFIX}/products`, productsRoutes);
app.use(`/${BASE_PREFIX}/cart`, cartRoutes);

// express().liste()

app.get(`/${BASE_PREFIX}/alive`, (req, res) => {
  res.json({ message: `Hola hiciste tu 1ra api, y esta ejecutandose` });
});



app.listen(PORT, () => {
    console.log(`APP por el Puerto ${PORT}`);
  });
