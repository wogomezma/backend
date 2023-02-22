
const fs = require("fs");
const path = require("path");

class CartManager {

    static cid = 0;

    constructor(path) { this.products = [];
      this.path = path}
    
  
      getdb(){
        const listproducts = fs.readFileSync(this.path, "utf-8");
        this.products = JSON.parse(listproducts)
        console.log("Get Base de Datos");
      }
  
  
      updatedb(){
        console.log("Base de datos actualizada");
        return fs.writeFileSync(this.path, JSON.stringify(this.products));
        
      }


    getProducts() {
      try {
        this.getdb()
         return console.log(this.products);
      } catch (error) {
      }
    }



    getProductById(cid){

      this.getdb()
  
             /* Funcion para buscar ID*/
    const findElement = (array, searchedCID) => {
        return array.find(element => element.cid === searchedCID) ?? "error no encuentra el producto";
      }
      
      const cidbuscado = findElement(this.products, cid)


      return console.log(cidbuscado);

    }

    generateID() {
      try {
        if (this.products.length === 0) return 1;
        return this.products[this.products.length - 1].id + 1;
      } catch (error) {
        console.log(
          "error:", error
        );
      }
    }

    addProduct(id) {

 //Agrega Carrito con ID Generado desde cart.routes
      this.getdb()

        this.products.push({ id, products: [] });
        this.updatedb()

      }

      addProduct2(cid,pid) {

//Agrega Producto a Carrito        
        this.getdb()
        
        const cart = this.products.find((u) => {
          return u.id === Number(cid);
        });

        const objcart = cart.products

        console.log("productos carrito", cart);

        if (objcart.some((item) => item.id === pid)) {
          const index = objcart.findIndex((item) => item.id === pid);
          objcart[index].quantity++;
        } else {
          objcart.push({ id: pid, quantity: 1 });
        }
         console.log("carrito final", objcart);

        this.updatedb()
      }
    }
        

/*         const updateProduct = this.products
                  
       const cartproducts = updateProduct.find((u) => {
          return u.id === Number(cid);
        });

        const cartproducts2 = cartproducts.products

        console.log("productos encontrados en carrito", cartproducts2);
        
         const findElement1 = (array, searchedID) => {
          return array.find(element => element.id === searchedID) ?? "error no encuentra el producto";
        }
        
        const idrepetido = findElement1(cartproducts2, pid) 
        
        if (idrepetido == false) {

               
         const cartproducts2 = cartproducts.products
   
        console.log("cartproducts2", cartproducts2);

          console.log("Producto ", pid, "no repetido");

        cartproducts2.push({id: pid, quantity: 1});

           
          console.log("nuevo carrito id ",cid," carrito ", cartproducts2);
    
           const indiceencontrado = updateProduct.map(item => item.id).indexOf(cid);
          updateProduct[indiceencontrado] ={...updateProduct[indiceencontrado], id: cid, products: cartproducts2};
            
            this.products = updateProduct
            this.updatedb() 


    
          } else {

            console.log("Producto ", pid, "repetido");

            const product = cartproducts2.find((u) => {
              return u.id === Number(pid);
            });

            console.log("producto repetido", product);

            const quantity = Number(product.quantity)+1

            const indiceencontrado2 = updateProduct.map(item => item.id).indexOf(pid);
            cartproducts2[indiceencontrado2] ={...cartproducts2[indiceencontrado2], id: pid, quantity: quantity};

            console.log("new carritoprodtc2", cartproducts2);   

            console.log("Actualizacion producto en carrito id ",cid," actualizacion productos de ", cartproducts2);
    
           const indiceencontrado = updateProduct.map(item => item.id).indexOf(cid);
            updateProduct[indiceencontrado] ={...updateProduct[indiceencontrado], id: cid, products: cartproducts2};
              this.updatedb() 
    
          }

    }*/

  
    /**Creacion Instancias */
     const CartManagerA = new CartManager(path.join(__dirname, "CartManagerA.json"));


module.exports = CartManagerA;
