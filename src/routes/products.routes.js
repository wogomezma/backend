
const { Router } = require("express");
const fs = require("fs"); 
const ProductManagerA = require("../ProductManager")
const listproducts2 = require("../ProductManagerA.json")


const router = Router();
const listproducts = ProductManagerA
// getAllProducts
// /api/products

// filtrar por productos
router.get(`/`, (req, res) => {
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

  router.get(`/:id`, (req, res) => {
    console.log("PARAMS", req.params);
    const id = req.params.id;
  
    if (isNaN(id)) {
      return res.status(400).json({
        ok: true,
        message: `no existe el producto con el id ${id}`,
        queryParams: req.query,
      });
    }
  
    const products = listproducts2.find((u) => {
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



router.post(`/`, (req, res) => {
  const productBody = req.body;
  console.log("productBody:", productBody);
  const lastId = listproducts[listproducts.length - 1].id;
  const newproduct = { id: lastId + 1, ...productBody };
  res.json({ ok: true, message: `Producto creado`, producto: newproduct });
  ProductManagerA.addProduct(productBody)
});

router.put(`/:id`, (req, res) => {
  console.log("PARAMS Update", req.params);
  const id = req.params.id;
  const campos = req.body
  const updateProducts = listproducts2
  if (isNaN(id)) {
    return res.status(400).json({
      ok: true,
      message: `no existe el producto con el id ${id}`,
      queryParams: req.query,
    });
  }

  const products = listproducts2.find((u) => {
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

  Array.prototype.indexOfObject = function arrayObjectIndexOf(property, value) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i][property] === value) return i;
    }
    return -1;
}

const indiceencontrado = updateProducts.indexOfObject("id", Number(id));

  console.log("Id buscado", id);
        console.log("indiceecontradoupdate", indiceencontrado);
        console.log("actualizando producto:", campos);
        updateProducts[indiceencontrado] ={...updateProducts[indiceencontrado], price: campos.price, title: campos.title, description: campos.description, thumbnail: campos.thumbnail, stock: campos.stock, code:campos.code};
  ProductManagerA.updateProduct(Number(id), campos)
  return res.json({ ok: true, message: `products actualizado con id: ${id}`, updateProducts});
  
});

router.delete(`/:id`, (req, res) => {
  console.log("PARAMS", req.params);
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(400).json({
      ok: true,
      message: `no existe el producto con el id ${id}`,
      queryParams: req.query,
    });
  }

  const products = listproducts2.find((u) => {
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
  const indiceencontrado = listproducts2.map(item => item.id).indexOf(Number(id));
  console.log("Archivo a Eliminar", indiceencontrado);
  listproducts2.splice(indiceencontrado,1)
  ProductManagerA.deleteProduct(Number(id))
  return res.json({ ok: true, message: `products id: ${id}`, listproducts2 });
});



module.exports = router;