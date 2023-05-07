const ProductsManager = require("../services/products.service");
const { productsModel, findUserByCode, } = require('../models/products.model');

class ProductCtrl {
    productManager;
  constructor() {
    this.productManager = new ProductsManager();
  }

  getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const
         {
            docs,
            totalDocs,
            limit: limitPag,
            totalPages,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
          } = await this.productManager.getAllProducts(req);
    

      
      return res.json({
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
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getProductsById = async (req, res) => {
    try {
      const productsDetail = await this.productManager.getProductsById(req, res);
      
      if (!productsDetail) {
        res.json({ message: `this products does not exist` });
      } else {
        return res.json({
          message: `get products info successfully`,
          products: productsDetail,
        });
      }
    } catch (error) {
      return res.status(500).json({ messagegetProductsById: error.message });
    }
  };
  


  createProducts = async (req, res) => {
    try {
        console.log("BODY en Controller ****", req.body);
        const productcode = req.body.code;
        const existingProduct = await findUserByCode(productcode);
    
        if (existingProduct) {
          return res.status(400).json({ message: "Product already exists" });
        }
    
        const newProducts = await this.productManager.createProducts(req);
    
        if (!newProducts) {
          return res.status(500).json({ message: "Products creation failed" });
        }
    
        return res.status(201).json({
          message: `Products created`,
          user: newProducts,
        });
          
      } catch (error) {
        return res.status(500).json({ messagecreateproducts: error.message });
      }
  };

  deleteProducts = async (req, res) => {
    try {
        const deleteProductsById = await this.productManager.deleteProduct(req, res);
        if (!deleteProductsById) {
          res.json({ message: `this products does not exist` });
        }
        return res.json({
            message: `deleteProductsById with ROLE ADMIN`,
            idproductdelete: req.params.productsId,
            product: deleteProductsById,
          });
      } catch (error) {
        return res.status(500).json({ messagedeleteproducts: error.message });
      }
  };

  
  updateProducts = async (req, res) => {
    try {
      const updatedProduct = await this.productManager.updateProduct(req, res);
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      return res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      return res.status(500).json({ messageupdateproducts: error.message });
    }
  };
  

}

module.exports = ProductCtrl;