const { productsModel, findUserByCode, } = require('../models/products.model');

class ProductsManager {
  getAllProducts = async (req) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const produts = await productsModel.paginate({}, { page, limit });
  
      return produts;
    } catch (error) {
      console.log(
        "🚀 ~ file: products.managers.js:9 ~ ProductsRoutes ~ this.router.get ~ error:",
        error
      );
    }
  };
  

  getProductsById = async (req, res) => {
    try {
      const productsDetail = await productsModel.findById({ _id: req.params.productsId });
      console.log("🚀 ~ file: products.service.js:22 ~ ProductsManager ~ getProductsById= ~ productsDetail:", productsDetail)

      return productsDetail;
    } catch (error) {
      console.log(
        "🚀 ~ file: products.manager.js:22 ~ ProductsManager ~ getProductsById= ~ error:",
        error
      );
    }
  };

  createProducts = async (req, res) => {
    try {
      console.log("BODY Service****", req.body);
  
      const { name, description, price, code, stock, thumbnail } = req.body;
  
      const productAdd = { name, description, price, code, stock, thumbnail };
      console.log("🚀 ~ file: products.service.js:39 ~ ProductsManager ~ createProducts= ~ productAdd:", productAdd)
  
      const currentUser = req.user;
      console.log("🚀 ~ file: products.service.js:41 ~ ProductsManager ~ createProducts= ~ currentUser:", currentUser)
      
      const {user}=currentUser
      console.log("🚀 ~ file: products.service.js:45 ~ ProductsManager ~ createProducts= ~ user:", user)

      if (user.rol='premium') {
        // Si el usuario es premium, establecer el campo "owner" en el correo electrónico del usuario
        productAdd.owner = user.id;
        console.log("🚀 ~ file: products.service.js:47 ~ ProductsManager ~ createProducts= ~ currentUser.id:", user.id)
      } else {
        // Si el usuario no es premium, establecer el campo "owner" en el valor predeterminado es el id del usuario admin
        productAdd.owner = "6456bd9dfd56bf8da0524331";
      }
  
      console.log("🚀 ~ file: products.service.js:52 ~ ProductsManager ~ createProducts= ~ productAdd:", productAdd)

      const newProducts = await productsModel.create(productAdd);
      console.log(
        "🚀 ~ file: products.service.js:41 ~ ProductsManager ~ createProducts= ~ newProducts:",
        newProducts
      );
  
      return newProducts;
    } catch (error) {
      console.log(
        "🚀 ~ file: products.manager.js:47 ~ ProductsManager ~ createProducts= ~ error:",
        error
      );
    }
  };
  


  deleteProduct = async (req, res) => {
    try {
      
        // Si el usuario no es premium, eliminar el producto sin verificar el propietario
        const deleteProductById = await productsModel.deleteOne({ _id: req.params.productsId });
        return deleteProductById;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  updateProduct = async (req, res) => {
    try {
      const { name, description, price, stock, thumbnail } = req.body;
      const updatedProduct = await productsModel.findByIdAndUpdate(
        req.params.productsId,
        { $set: { name, description, price, stock, thumbnail } },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        throw new Error("Product not found");
      }

      return updatedProduct;
    } catch (error) {
      console.log(
        "🚀 ~ file: products.manager.js ~ ProductsManager ~ updateProduct= ~ error:",
        error
      );
    }
  };


}

module.exports = ProductsManager;