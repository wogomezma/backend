
const { Router } = require("express");
const fs = require("fs"); 
const ProductManagerA = require("../ProductManager")
const listproducts0 = require("../ProductManagerA.json")
const CartManagerA = require("../CartManager")
const listproducts2 = require("../CartManagerA.json")


const router = Router();
const listproducts = []
const carts = []
// getAllProducts
// /api/products

// filtrar por productos
router.get(`/`, (req, res) => {
    console.log("Query PARAMS", req.query);
    const { limit } = req.query;
  
    console.log(carts);
    let listaFiltrada = Object.assign({}, ...Object.entries(listproducts2).slice(0, limit)
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
  const id = CartManagerA.generateID()
  console.log("productBody:", productBody);
  console.log("Id generado: ",id);
  /* const lastId = listproducts[listproducts.length - 1].id; */
  /* const newproduct = { id: lastId + 1, ...productBody }; */
  res.json({ ok: true, message: `carrito creado`, producto: productBody });
  /* CartManagerA.addProduct(productBody); */
  carts.push(id,productBody);
  CartManagerA.addProduct(id, productBody)
  console.log("Carrito:", carts);
});


router.post(`/:cid/product/:pid`, (req, res) => {
  console.log("PARAMS", req.params);
  const cid = req.params.cid;
  const pid = req.params.pid;
 
  const newaddproducts = listproducts2.find((u) => {
    return u.id === Number(pid);
  });

console.log("producto a agregar es:",newaddproducts);

  carts.push(Number(cid),newaddproducts.id)

  console.log("Carrito despues de agregar producto", carts);

  CartManagerA.addProduct2(Number(cid), newaddproducts.id)

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
  CartManagerA.updateProduct(Number(id), campos)
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
  CartManagerA.deleteProduct(Number(id))
  return res.json({ ok: true, message: `products id: ${id}`, listproducts2 });
});



module.exports = router;