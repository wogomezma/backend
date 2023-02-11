const express = require("express");
const listproducts = require("./ProductManagerA.json");
const ProductManager = require("./ProductManager")


const PORT = 8080

const app = express();

const products = ProductManager

app.get(`/`, (request, response)=> {
    response.send("Prueba Express")

})

// filtrar por productos
app.get(`/products`, (req, res) => {
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

// // Mostrar solo el ID
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
  });


// express().liste()
app.listen(PORT, () => {
    console.log(`APP por el Puerto ${PORT}`);
  });
