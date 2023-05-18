const ProductsManager = require("../services/products.service");
const { productsModel, findUserByCode, } = require('../models/products.model');
const { EnumErrors, HttpResponses } = require("../middleware/error-handle");
const setLogger = require('../utils/logger');
const express = require('express');
const app = express();
app.use(setLogger);

const httpResp = new HttpResponses();

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
      if (!req.params.productsId || isNaN(req.params.productsId) || req.params.productsId < 0) {
        req.logger.debug(`Invalid Params for productsId: ${req.params.productsId}`);
        return httpResp.BadRequest(
          res,
          `${EnumErrors.INVALID_PARAMS} - Invalid Params for productsId `
        );
      }
      
      const productsDetail = await this.productManager.getProductsById(req, res);
      
      // You can also log the success case
      req.logger.debug(`Products info fetched successfully: ${JSON.stringify(productsDetail)}`);
      
      return res.json({
        message: `get products info successfully`,
        products: productsDetail,
      });

    } catch (error) {
      // log the error with the 'debug' level
      req.logger.debug(`Error while fetching products info: ${error}`);
      
      return httpResp.Error(
        res,
        `${EnumErrors.DATABASE_ERROR} - ERROR DB ${error} `
      );
    }
};



  createProducts = async (req, res) => {
    try {
        console.log("BODY en Controller ****", req.body);

       
        let { name, description, price, code, stock, thumbnail } = req.body;

        // Lista de campos requeridos y sus tipos
        const requiredFields = {
          name: 'String',
          description: 'String',
          price: 'Number',
          code: 'String',
          stock: 'Number',
          thumbnail: 'String'
        };

        // Lista para almacenar los campos que faltan
        let missingFields = [];

        if (!name) {
          missingFields.push('name');
        }

        if (!description) {
          missingFields.push('description');
        }

        if (!price) {
          missingFields.push('price');
        }

        if (!code) {
          missingFields.push('code');
        }

        if (!stock) {
          missingFields.push('stock');
        }

        if (!thumbnail) {
          missingFields.push('thumbnail');
        }

        // Si faltan campos, enviamos un error personalizado
        if (missingFields.length > 0) {
          let errorMsg = 'Missing required fields: ';

          missingFields.forEach(field => {
            errorMsg += `\n - ${field} (${requiredFields[field]})`;
          });
          
          console.log(errorMsg);
          req.logger.http(`Error with GET /${errorMsg}/`);
          return httpResp.BadRequest(
            res,
            `${EnumErrors.INVALID_PARAMS} - ${errorMsg} is required`
          );
        }



        
        const productcode = req.body.code;
        const existingProduct = await findUserByCode(productcode);
    
        if (existingProduct) {
          return httpResp.Error(
            res,
            `${EnumErrors.PRODUCT_DUPLICATED} - PRODUCT DUPLICATED ${error} `
          );
        }
    
        const newProducts = await this.productManager.createProducts(req);
    
        if (!newProducts) {
          return httpResp.BadRequest(
            res,
            `${EnumErrors.CREATE_PRODUCT_ERROR} - INVALID PARAMS ${error} `
          );
        }
    
        return res.status(201).json({
          message: `Products created`,
          user: newProducts,
        });
          
      } catch (error) {
        return httpResp.Error(
          res,
          `${EnumErrors.CREATE_PRODUCT_ERROR} - INVALID PARAMS ${error} `
        );
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