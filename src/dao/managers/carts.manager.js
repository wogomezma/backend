const cartsModel = require("../models/carts.model");
const ProductsManager = require("../managers/products.managers");
const mongoose = require("mongoose");


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
      return await cartsModel.findById({ _id: id });
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:21 ~ CartsManager ~ getCartsById= ~ error:",
        error
      );
    }
  };

  createCarts = async (cartsBody) => {
    try {
      const checkCarts = await cartsModel.findOne({
        title: `${cartsBody.title.toLowerCase()}`,
      });

      if (checkCarts) {
        return null;
      }

      const newCarts = await cartsModel.create({
        ...cartsBody,
        title: cartsBody.title.toLowerCase(),
      });

      return newCarts;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:45 ~ CartsManager ~ createCarts=async ~ error:",
        error
      );
    }
  };


  CartsAgregate = async (cid,pid) => {

    try {
      console.log("🚀 ~ file: carts.manager.js:57 ~ CartsManager ~ CartsAgregate= ~ idproduct:", pid)
      console.log("🚀 ~ file: carts.manager.js:57 ~ CartsManager ~ CartsAgregate= ~ cartId:", cid)



      const cartsById = await cartsModel.aggregate([
        { $group: { _id: cid, carts: { $push: "$$ROOT" } } },
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
      console.log("🚀 ~ file: carts.manager.js:57 ~ CartsManager ~ CartsAgregate= ~ idproduct:", pid)
      console.log("🚀 ~ file: carts.manager.js:57 ~ CartsManager ~ CartsAgregate= ~ cartId:", cid)
      console.log("🚀 ~ file: carts.manager.js:98 ~ CartsManager ~ CartsAgregateOne= ~ quantity:", quantitynew)


      const cartsById = await cartsModel.aggregate([
        { $group: { _id: cid, carts: { $push: "$$ROOT" } } },
      ]);


      const productsold = cartsById[0].carts
      const objcart = productsold[0].products;
      console.log("🚀 ~ file: carts.manager.js:113 ~ CartsManager ~ CartsAgregateOne= ~ objcart:", objcart)


      if (objcart.some((item) => item.id === pid)) {
        const index = objcart.findIndex((item) => item.id === pid);
        objcart[index].quantity=quantitynew;
      } else {
        objcart.push({ id: pid, quantity: 1 });
      }
       console.log("carrito final", objcart);
       console.log("🚀 ~ file: carts.manager.js:82 ~ CartsManager ~ CartsAgregate= ~ objcart:", objcart)



      const addproductincart = await cartsModel.updateOne({_id : {$eq:cid}} , {$set : {products: objcart} })
     
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
      console.log("🚀 ~ file: carts.manager.js:57 ~ CartsManager ~ CartsAgregate= ~ idproduct:", pid)
      console.log("🚀 ~ file: carts.manager.js:57 ~ CartsManager ~ CartsAgregate= ~ cartId:", cid)
      console.log("🚀 ~ file: carts.manager.js:98 ~ CartsManager ~ CartsAgregateAll= ~ quantity:", quantity)


/*       const cartsById = await cartsModel.aggregate([
        { $group: { _id: cid, carts: { $push: "$$ROOT" } } },
      ]);
 */

/*       const productsold = cartsById[0].carts
      const objcart = productsold[0].products; */

      const objcart = []
      objcart.push({id: pid,quantity: quantity})
      console.log("🚀 ~ file: carts.manager.js:116 ~ CartsManager ~ CartsAgregateAll= ~ objcart:", objcart)



/*       if (objcart.some((item) => item.id === pid)) {
        const index = objcart.findIndex((item) => item.id === pid);
        objcart[index].quantity++;
      } else {
        objcart.push({ id: pid, quantity: 1 });
      } */

      const addproductincart = await cartsModel.updateOne({_id : {$eq:cid}} , {$set : {products: objcart} })
     
      return addproductincart;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:70 ~ CartsManager ~ createCarts=async ~ error:",
        error
      );
    }
  };


  CartsDelAllProducts = async (cid,pid) => {

    try {
      
      const cartsById = await cartsModel.aggregate([
        { $group: { _id: cid, carts: { $push: "$$ROOT" } } },
      ]);


      const productsold = cartsById[0].carts
      const arryproducts = productsold[0].products;
      console.log("🚀 ~ file: carts.manager.js:116 ~ CartsManager ~ CartsDelAllProducts= ~ arryproducts:", arryproducts)

      const indiceencontrado = arryproducts.map(item => item.id).indexOf(pid);
      var objdel = arryproducts.splice(indiceencontrado,1)
      
      console.log("🚀 ~ file: carts.manager.js:119 ~ CartsManager ~ CartsDelAllProducts= ~ arryproducts:", arryproducts)
             
      const delproductincart = await cartsModel.updateOne({_id : {$eq:cid}} , {$set : {products: arryproducts} })

     
      return delproductincart;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:70 ~ CartsManager ~ createCarts=async ~ error:",
        error
      );
    }
  };

  CartsDelOneProducts = async (id) => {

    try {
      const arrdelproducts = []
      
       const delproducts = await cartsModel.updateOne({_id : {$eq:id}} , {$set : {products: arrdelproducts} })

     
      return delproducts;
    } catch (error) {
      console.log(
        "🚀 ~ file: carts.manager.js:70 ~ CartsManager ~ createCarts=async ~ error:",
        error
      );
    }
  };









}



module.exports = CartsManager;