const cartsModel = require("../models/carts.model");
const ProductsManager = require("./products.service");
const mongoose = require("mongoose");
const { userModel, findUserByEmail } = require('../models/user.model');
const {  productsModel,  findUserByCode } = require("../models/products.model");
const ticketModel = require('../models/ticket.model');
const TicketsManager = require("./tickets.service");




class CartsManager {
  getAllCarts = async () => {
    try {
      const allCarts = await cartsModel.find({});

      return allCarts;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:11 ~ CartsManager ~ getAllCarts=async ~ error:",
        error
      );
    }
  };

  getCartsById = async (id) => {
    try {
      return await cartsModel.findById(id).populate('products.product');
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:21 ~ CartsManager ~ getCartsById= ~ error:",
        error
      );
      throw error; // Debes lanzar el error para que se maneje correctamente en el controlador.
    }
  };
  

  // createCarts = async (req,res) => {
  //   try {
  //     const newCarts = await cartsModel.create();
  //     console.log("🚀 ~ file: carts.manager.js:46 ~ CartsManager ~ createCarts= ~ newCarts:", newCarts)
  //     const {
  //       user: { id },
  //     } = req.user;
    

  //     const userData = await userModel.findById({ _id: id });
  //     console.log("🚀 ~ file: carts.service.js:43 ~ CartsManager ~ createCarts= ~ userData:", userData)
     

  //     userData.carts.push({ cart: newCarts._id });
  //     console.log("🚀 ~ file: carts.service.js:47 ~ CartsManager ~ createCarts= ~ userData:", userData)


  //     const updatedCarts = await userModel.updateOne({ _id: id }, userData);
  //     console.log("🚀 ~ file: carts.service.js:51 ~ CartsManager ~ createCarts= ~ updatedCarts:", updatedCarts)
  //     return newCarts;
  //   } catch (error) {
  //     console.log(
  //       "🚀 ~ file: carts.manager.js:45 ~ CartsManager ~ createCarts=async ~ error:",
  //       error
  //     );
  //   }
  // };

  createCarts = async (req) => {
    try {
      const newCart = await cartsModel.create();
  
      const {
        user: { id },
      } = req.user;
  
      const userData = await userModel.findById(id);
  
      userData.cart = newCart._id;
  
      await userData.save();
  
      return newCart;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:45 ~ CartsManager ~ createCarts=async ~ error:",
        error
      );
    }
  };
  

  updateCart = async (req) => {
    try {
      const { cid, pid } = req.params;
      const quantity = 1
  
      // Buscar el carrito por ID
      const cart = await cartsModel.findById(cid);
  
      if (!cart) {
        throw new Error("Cart not found");
      }
  
      // Buscar el producto por ID
      const product = await productsModel.findById(pid);
  
      if (!product) {
        throw new Error("Product not found");
      }
  
      // Verificar si el producto ya está en el carrito
      const productIndex = cart.products.findIndex((item) => item.product.toString() === pid);
  
      if (productIndex !== -1) {
        // Si el producto ya está en el carrito, aumentar la cantidad
        cart.products[productIndex].quantity += parseInt(quantity);
        // Actualizar el precio sumando el nuevo precio (price * quantity) al precio existente en el carrito
        cart.products[productIndex].price += product.price * parseInt(quantity);
      } else {
        // Si el producto no está en el carrito, agregarlo con la cantidad especificada y el precio del producto multiplicado por la cantidad
        cart.products.push({
          product: pid,
          quantity: parseInt(quantity),
          price: product.price * parseInt(quantity),
        });
      }
  
      // Guardar el carrito actualizado
      const updatedCart = await cart.save();
  
      return updatedCart;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.service.js ~ CartsManager ~ updateCart= ~ error:",
        error
      );
    }
  };
  

  deleteCart = async (req) => {
    try {
      const { cid } = req.params;
      const { pid } = req.query;

      // Buscar el carrito por ID
      const cart = await cartsModel.findById(cid);

      if (!cart) {
        throw new Error("Cart not found");
      }

      // Verificar si el producto ya está en el carrito
      const productIndex = cart.products.findIndex((item) => item.product.toString() === pid);

      if (productIndex !== -1) {
        // Si el producto está en el carrito, eliminarlo
        cart.products.splice(productIndex, 1);
      } else {
        throw new Error("Product not found in cart");
      }

      // Guardar el carrito actualizado
      const updatedCart = await cart.save();

      return updatedCart;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.service.js ~ CartsManager ~ deleteCart= ~ error:",
        error
      );
    }
  };

  getProductsFromCart = async (cart) => {
    const products = [];
    for (const item of cart.products) {
      const product = await productsModel.findById(item.product._id);
      if (!product) {
        throw new Error(`Product with id ${item.product._id} not found`);
      }
      products.push({ product, quantity: item.quantity, price: item.product.price });
    }
    return products;
  };

purchaseCart = async (req) => {
  try {
    const { cid } = req.params;
    const cart = await cartsModel.findById(cid).populate('products.product');
    console.log("🚀 ~ file: carts.service.js:166 ~ CartsManager ~ purchaseCart= ~ cart:", cart)

    if (!cart) {
      throw new Error("Cart not found");
    }
    let insufficientStockProducts = [];
    let purchasedProducts = [];

    for (let item of cart.products) {
      const product = await productsModel.findById(item.product._id);
      console.log("🚀 ~ file: carts.service.js:175 ~ CartsManager ~ purchaseCart= ~ product:", product)

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        purchasedProducts.push(item);
      } else {
        insufficientStockProducts.push(item);
      }
    }

    // Obtén los productos del carrito de compras
    purchasedProducts = await this.getProductsFromCart(cart);
    console.log("🚀 ~ file: carts.service.js:188 ~ CartsManager ~ purchaseCart= ~ purchasedProducts:", purchasedProducts)

    // Calcula el monto total de la compra
    const amount = purchasedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    console.log("🚀 ~ file: carts.service.js:192 ~ CartsManager ~ purchaseCart= ~ amount:", amount)

    // Crea un array de productos para el ticket
    const ticketProducts = purchasedProducts.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { email } = req.session.user;
    const user = await findUserByEmail(email);
    console.log("🚀 ~ file: carts.service.js:192 ~ CartsManager ~ purchaseCart= ~ user:", user)

        
        const ticketAdd = { amount: amount, purchaser: user._id, products: ticketProducts };
        const newTicket = await ticketModel.create(ticketAdd);
        console.log("🚀 ~ file: tickets.service.js:41 ~ TicketManager ~ createTickets= ~ newTicket:", newTicket)

 

    console.log("🚀 ~ newTicket:", newTicket);

    if (!newTicket) {
      throw new Error("Failed to create a ticket");
    }

    cart.products = insufficientStockProducts;
    const updatedCart = await cart.save();

    return {
      updatedCart,
      newTicket,
      insufficientStockProducts: insufficientStockProducts.map(item => item.product._id),
    };
  } catch (error) {
    console.log("🚀 ~ file: carts.service.js ~ CartsManager ~ purchaseCart= ~ error:", error);
  }
};

  
  CartsAgregate = async (cid,pid) => {

    try {
      console.log("🚀 ~ file: carts.manager.js:57 ~ CartsManager ~ CartsAgregate= ~ idproduct:", pid)
      console.log("🚀 ~ file: carts.manager.js:57 ~ CartsManager ~ CartsAgregate= ~ cartId:", cid)



      const objectId = new mongoose.Types.ObjectId(cid);
      const cartsById = await cartsModel.aggregate([
        { $match: { _id: objectId } },
        { $group: { _id: "$_id", carts: { $push: "$$ROOT" } } },
      ]);


      const productsold = cartsById[0].carts
      const objcart = productsold[0].products;


      console.log("productos carrito", objcart);

      if (objcart.some((item) => item.id === pid)) {
        const index = objcart.findIndex((item) => item.id === pid);
        objcart[index].quantity++;
      } else {
        objcart.push({ id: pid, quantity: 1 });
      }
       console.log("carrito final", objcart);
       console.log("🚀 ~ file: carts.manager.js:82 ~ CartsManager ~ CartsAgregate= ~ objcart:", objcart)



      const addproductincart = await cartsModel.updateOne({_id : {$eq:cid}} , {$set : {products: objcart} })
      console.log("🚀 ~ file: carts.manager.js:89 ~ CartsManager ~ CartsAgregate= ~ addproductincart:", addproductincart)
     
      return addproductincart;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:70 ~ CartsManager ~ createCarts=async ~ error:",
        error
      );
    }
  };

  CartsAgregateOne = async (cid,pid,quantitynew) => {



    try {
      console.log("🚀 ~ file: carts.manager.js:98 ~ CartsManager ~ CartsAgregateOne= ~ cid:", cid)
      console.log("🚀 ~ file: carts.manager.js:98 ~ CartsManager ~ CartsAgregateOne= ~ pid:", pid)
      console.log("🚀 ~ file: carts.manager.js:98 ~ CartsManager ~ CartsAgregateOne= ~ quantitynew:", quantitynew)

/*       const cartsById = await cartsModel.aggregate([
        { $group: { _id: cid, carts: { $push: "$$ROOT" } } },
      ]); */

      const objectId = new mongoose.Types.ObjectId(cid);
      const cartsById = await cartsModel.aggregate([
        { $match: { _id: objectId } },
        { $group: { _id: "$_id", carts: { $push: "$$ROOT" } } },
      ]);  

      let newcarts = await cartsModel.find({_id: cid})
      console.log("🚀 ~ file: carts.manager.js:120 ~ CartsManager ~ CartsAgregateAll= ~ carts:", newcarts)
      newcarts.products=[]
      delete newcarts._id;
      newcarts.products.push({product:pid,quantity:quantitynew})
      console.log("🚀 ~ file: carts.manager.js:124 ~ CartsManager ~ CartsAgregateAll= ~ carts:", newcarts)

      const productsold = cartsById[0].carts
      console.log("🚀 ~ file: carts.manager.js:127 ~ CartsManager ~ CartsAgregateOne= ~ productsold:", productsold)
      
      
      const objcart = productsold[0].products;
      console.log("🚀 ~ file: carts.manager.js:131 ~ CartsManager ~ CartsAgregateOne= ~ objcart:", objcart)

/*       const productToFind = new ObjectId(pid);
      const result = array.find(item => item.product.equals(productToFind)); */
/*        if (objcart.some((item) => item.product === pid)) {
        const index = objcart.findIndex((item) => item.product === pid);
        objcart[index].quantity=quantitynew;
        console.log("🚀 ~ file: carts.manager.js:138 ~ CartsManager ~ CartsAgregateOne= ~ index:", index)
        
      } else {
        objcart.push({ product:pid, quantity: quantitynew });
        console.log("🚀 ~ file: carts.manager.js:142 ~ CartsManager ~ CartsAgregateOne= ~ objcart:", objcart)
        
      }  */
      let index = -1;
      for(let i = 0; i < objcart.length; i++) {
        if(objcart[i].product.toString() === pid) {
          index = i;
          
          break;
      }}

      console.log("🚀 ~ file: carts.manager.js:153 ~ CartsManager ~ CartsAgregateOne= ~ index:", index)
      
      if(index === -1){
        objcart.push({ product:pid, quantity: quantitynew }
          )
        console.log("🚀 ~ file: carts.manager.js:158 ~ CartsManager ~IF CartsAgregateOne= ~ objcart:", objcart)
        }else{
          objcart[index].quantity=quantitynew;
          console.log("🚀 ~ file: carts.manager.js:161 ~ CartsManager ~ELSE CartsAgregateOne= ~ objcart:", objcart)
        }


    /*   objcart.push({ id: pid, quantity: quantitynew }) */
       console.log("🚀 ~ file: carts.manager.js:139 ~ CartsManager ~ CartsAgregateOne= ~ objcart:", objcart)


      const addproductincart = await cartsModel.updateOne({_id : {$eq:cid}} , {$set : {products: objcart} })
      console.log("🚀 ~ file: carts.manager.js:143 ~ CartsManager ~ CartsAgregateOne= ~ addproductincart:", addproductincart)
     
      return addproductincart;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:70 ~ CartsManager ~ createCarts=async ~ error:",
        error
      );
    }
  };

  CartsAgregateAll = async (cid,pid,quantity) => {
  
    try {
      console.log("🚀 ~ file: carts.manager.js:154 ~ CartsManager ~ CartsAgregateAll= ~ cid:", cid)
      console.log("🚀 ~ file: carts.manager.js:154 ~ CartsManager ~ CartsAgregateAll= ~ pid:", pid)
      console.log("🚀 ~ file: carts.manager.js:154 ~ CartsManager ~ CartsAgregateAll= ~ quantity:", quantity)
/*       const objcart = []
      objcart.push({products: pid,quantity: quantity})
      console.log("🚀 ~ file: carts.manager.js:162 ~ CartsManager ~ CartsAgregateAll= ~ objcart:", objcart) */

/*       const objectId = new mongoose.Types.ObjectId(cid);
      const cartsById = await cartsModel.aggregate([
        { $match: { _id: objectId } },
        { $group: { _id: "$_id", carts: { $push: "$$ROOT" } } },
      ]); */

      let newcarts = await cartsModel.find({_id: cid})
      console.log("🚀 ~ file: carts.manager.js:172 ~ CartsManager ~ CartsAgregateAll= ~ carts:", newcarts)
      newcarts.products=[]
      delete newcarts._id;
      newcarts.products.push({product:pid,quantity:quantity})
      console.log("🚀 ~ file: carts.manager.js:174 ~ CartsManager ~ CartsAgregateAll= ~ carts:", newcarts)

      /* const addproductincart = await cartsModel.updateOne({_id : {$eq:cid}} , {$set : {products: objcart} }) */
      const addproductincart = await cartsModel.updateOne({_id : {$eq:cid}} , {$set : {products: newcarts.products} })
      console.log("🚀 ~ file: carts.manager.js:175 ~ CartsManager ~ CartsAgregateAll= ~ addproductincart:", addproductincart)
     
      return addproductincart;
    } catch (error) {
      console.log("🚀 ~ file: carts.manager.js:179 ~ CartsManager ~ CartsAgregateAll= ~ error:", error)
      
    }
  };


  CartsDelAllProducts = async (cid,pid) => {

    try {
      
    const objectId = new mongoose.Types.ObjectId(cid);
      const cartsById = await cartsModel.aggregate([
        { $match: { _id: objectId } },
        { $group: { _id: "$_id", carts: { $push: "$$ROOT" } } },
      ]); 


      const productsold = cartsById[0].carts
      const arryproducts = productsold[0].products;
      console.log("🚀 ~ file: carts.manager.js:198 ~ CartsManager ~ CartsDelAllProducts= ~ arryproducts:", arryproducts)


      const indiceencontrado = arryproducts.map(item => item.id).indexOf(pid);
      var objdel = arryproducts.splice(indiceencontrado,1)
      console.log("🚀 ~ file: carts.manager.js:203 ~ CartsManager ~ CartsDelAllProducts= ~ arryproducts:", arryproducts)
      
 
             
      const delproductincart = await cartsModel.updateOne({_id : {$eq:cid}} , {$set : {products: arryproducts} })
      console.log("🚀 ~ file: carts.manager.js:208 ~ CartsManager ~ CartsDelAllProducts= ~ delproductincart:", delproductincart)

     
      return delproductincart;
    } catch (error) {
    console.log("🚀 ~ file: carts.manager.js:213 ~ CartsManager ~ CartsDelAllProducts= ~ error:", error)

    }
  };

  CartsDelOneProducts = async (id) => {

    try {
      const arrdelproducts = []
      
       const delproducts = await cartsModel.updateOne({_id : {$eq:id}} , {$set : {products: arrdelproducts} })
       console.log("🚀 ~ file: carts.manager.js:224 ~ CartsManager ~ CartsDelOneProducts= ~ delproducts:", delproducts)

     
      return delproducts;
    } catch (error) {
    console.log("🚀 ~ file: carts.manager.js:228 ~ CartsManager ~ CartsDelOneProducts= ~ error:", error)

    }
  };









}



module.exports = CartsManager;