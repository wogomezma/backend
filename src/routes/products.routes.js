const { Router } = require("express");

const productsModel = require("../dao/models/products.model");

const productsData = require("../db/products");
const ProductsManager = require("../dao/managers/products.managers");
const { all } = require("./realtimep.routes");

class ProductsRoutes {
  path = "/products";
  router = Router();
  productsManager = new ProductsManager();

  constructor() {
    this.initProductsRoutes();
  }

  initProductsRoutes() {
    this.router.get(`${this.path}/insertion`, async (req, res) => {
      try {
        const products = await productsModel.insertMany(productsData);
        
        return res.json({
          message: "products insert successfully",
          productsInserted: products,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: products.routes.js:25 ~ ProductsRoutes ~ this.router.get ~ error:",
          error
        );
      }
    });

/*     this.router.get(`${this.path}`, async (req, res) => {
      try {
        const productsArr = await this.productsManager.getAllProducts();
        return res.json({
          message: `get all products succesfully`,
          productsLists: productsArr,
          productsAmount: productsArr.length,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: products.routes.js:44 ~ ProductsRoutes ~ this.router.get ~ error:",
          error
        );
      }
    }); */

    this.router.get(`${this.path}`, async (req, res) => {
      // /api/products?page=2&limit=10
      const { page = 1, limit = 10 } = req.query;
      const {
        docs,
        totalDocs,
        limit: limitPag,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
      } = await productsModel.paginate({}, { page, limit });
    
   
      res.json({
        message: `get all Products`,
        products: docs,
        length: totalDocs,
        limit: limitPag,
        page,
        totalPages,
        hasNextPage,
        nextPage,
        hasPrevPage,
        prevPage,
      });
    });


    this.router.get(`${this.path}/category`, async (req, res) => {
      try {
        const {category=all, order=-1 } = req.query;
        // Productos agrupados por categoria
        const productsByCategory = await productsModel.aggregate([
          { $match: { category: category } },
          { $group: { _id: "$category", products: { $push: "$$ROOT" } } },
          { $sort: { _id: Number(order) } },
        ]);
      
        return res.json({
          status: `queries de agrupacion por categoria`,
          productsByCategory,
        });
      } catch (error) {
      console.log("🚀 ~ file: products.routes.js:96 ~ ProductsRoutes ~ this.router.get ~ error:", error)
      }
    });

    this.router.get(`${this.path}/stock`, async (req, res) => {
      try {
        const {stock , order=-1 } = req.query;
        var stock1
        if (!(stock==null)){
          stock1=Number(stock)
        }else{stock1=all}
        // Productos agrupados por categoria
        const productsByStock = await productsModel.aggregate([
          { $match: { stock: stock1 } },
          { $group: { _id: "$stock", products: { $push: "$$ROOT" } } },    
          { $sort: { _id: Number(order) } },
          
        ]);
      
        return res.json({
          status: `Query for stock`,
          productsByStock,
        });
      } catch (error) {
        console.log("🚀 ~ file: products.routes.js:119 ~ ProductsRoutes ~ this.router.get ~ error:", error)
      }
    });


    this.router.get(`${this.path}/price`, async (req, res) => {
      try {
        const {price , order=-1 } = req.query;
        var price1
        if (!(price==null)){
         price1=Number(price)
        }else{price1=all}
        // Productos agrupados por categoria
        const productsByPrice = await productsModel.aggregate([
          { $match: { price: price1 } },
          { $group: { _id: "$price", products: { $push: "$$ROOT" } } },    
          { $sort: { _id: Number(order) } },]);
          return res.json({
            status: `Query for price`,
            productsByPrice,
          });
      
      } catch (error) {
        console.log("🚀 ~ file: products.routes.js:143 ~ ProductsRoutes ~ this.router.get ~ error:", error)
      }
    });


    this.router.get(`${this.path}/:productsId`, async (req, res) => {
      try {
        const { productsId } = req.params;
        const productsDetail = await this.productsManager.getProductsById(
          productsId
        );
       
        return res.json({
          message: `get products info of ${productsId} succesfully`,
          products: productsDetail,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: products.routes.js:60 ~ ProductsRoutes ~ this.router.get ~ error:",
          error
        );
      }
    });

    this.router.post(`${this.path}`, async (req, res) => {
      try {
       
        const productsBody = req.body;

        const newProducts = await this.productsManager.createProducts(productsBody);
        if (!newProducts) {
          return res.json({
            message: `the products with code ${productsBody.code} is already register`,
          });
        }

        return res.json({
          message: `products created successfully`,
          products: newProducts,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: products.routes.js:79 ~ ProductsRoutes ~ this.router.post ~ error:",
          error
        );
      }
    });
  }
}

module.exports = ProductsRoutes;