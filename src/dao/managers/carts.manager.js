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