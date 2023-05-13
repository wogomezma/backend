const { Router } = require("express");
const { generateProduct } = require("../utils/generate-product");

class MocksRoutes {
    path = "/mockingproducts";
    router = Router();
  
    constructor() {
      this.initMocksRoutes();
    }
  
    initMocksRoutes() {

        this.router.get(`${this.path}/`, async (req, res) => {
        let products = [];
        for (let index = 0; index < 100; index++) {
            products.push(generateProduct());
        }
        return res.json({
            message: `generate products`,
            products,
        });
        });


}
}


module.exports = MocksRoutes;