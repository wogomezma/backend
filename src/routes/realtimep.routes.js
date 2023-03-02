const { Router } = require("express");
const listproducts2 = require("../ProductManagerA.json")
const ProductManager = require("../ProductManager")
const router = Router();

router.get(`/`, (req, res) => {
    console.log("Query PARAMS Realtime", req.query);

    ProductManager.getProducts()
   


  var html = ProductManager.products
  .map(function (elem, index) {
    return `<div>
            <strong>ID ${elem.id}</strong>:
            </div>
            <em>Title: ${elem.title}</em>
            <p>Description: ${elem.description}</p>
            <p>Price: ${elem.price}</p>
            <p>Stock: ${elem.stock}</p>
          </div>`;
  }) 
     res.render("realtimeproducts",{ body: html });
  
 }); 
 

module.exports = router;