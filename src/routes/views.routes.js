const { Router } = require("express");
const ProductManagerA = require("../ProductManager")
const listproducts2 = require("../ProductManagerA.json")



const listproducts = ProductManagerA

const router = Router();

/* router.get("/", (req, res) => {
  res.render("home");
});
 */
router.get(`/`, (req, res) => {
  console.log("Query PARAMS", req.query);
  const title = JSON.stringify(listproducts2)

 console.log("productos a mostrar: ", ProductManagerA);
  res.render("home",{ body: title });

});

router.get(`/realtimeproducts`, (req, res) => {
  console.log("Query PARAMS", req.query);
  const title = JSON.stringify(listproducts2)

 console.log("productos a mostrar: ", ProductManagerA);
  res.render("realtimeproducts",{ body: title });

});

module.exports = router;