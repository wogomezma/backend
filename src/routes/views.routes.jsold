const { Router } = require("express");
const listproducts2 = require("../ProductManagerA.json")

const router = Router();


router.get(`/`, (req, res) => {
  console.log("Query PARAMS", req.query);
  const title = JSON.stringify(listproducts2)

 console.log("productos a mostrar en home: ", listproducts2[0].title);

 var html = listproducts2
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


  res.render("home",{ body: html });

});


module.exports = router;