
const fs = require("fs");
const path = require("path");

class ProductManager {

    static id = 0;

    constructor(path) { this.products = [];
      this.path = path}
    
      

      getdb(){
        const listproducts = fs.readFileSync(this.path, "utf-8");
        this.products = JSON.parse(listproducts)
      }
  
  
      updatedb(){
        return fs.writeFileSync(this.path, JSON.stringify(this.products));
      }


    getProducts() {
      try {
        this.getdb()
         return console.log(this.products);
      } catch (error) {
      }
    }

    

    getProductById(id){

      this.getdb()
  
             /* Funcion para buscar ID*/
    const findElement = (array, searchedID) => {
        return array.find(element => element.id === searchedID) ?? "error no encuentra el producto";
      }
      
      const idbuscado = findElement(this.products, id)


      return console.log(idbuscado);

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

    addProduct(title,description,price,thumbnail,stock,code) {

      this.getdb()

         /* Funcion para buscar code repetido*/
    const findElement = (array, searchedCode) => {
        return array.find(element => element.code === searchedCode) ?? false;
      }
      
      const coderepetido = findElement(this.products, code)

    if (coderepetido == false) {

  /*       /* ID Incremental
        ProductManager.id = ProductManager.id + 1; */
        const id = this.generateID()
        /* Agrega Producto */
        this.products.push({id,title,description,price,thumbnail,stock,code});
        this.updatedb()


      } else {
        console.log("Code repetido, favor cambiarlo");
 
      }

      }

      updateProduct(id, updatecampo, updateprice){
        this.getdb()
        const updateProducts = this.products
        const indiceencontrado = updateProducts.map(item => item.id).indexOf(id);
        console.log("indiceecontradoupdate", indiceencontrado);
        updateProducts[indiceencontrado] ={...updateProducts[indiceencontrado], [updatecampo]: updateprice};
        this.products = updateProducts
        this.updatedb()
        this.getProductById(id)
      }

      deleteProduct (id){
        this.getdb()
        const deleteProduct = this.products
        const indiceencontrado = deleteProduct.map(item => item.id).indexOf(id);
        var objdel = deleteProduct.splice(indiceencontrado,1)
        this.products = deleteProduct
        this.updatedb()
        console.log(objdel);
      }



    }

    /**Creacion Instancias */
    const ProductManagerA = new ProductManager(path.join(__dirname, "ProductManagerA.json"));

    /*Listar Productos sin crear*/
console.log(`lista de Productos: `);
ProductManagerA.getProducts();
console.log(".....");
    
console.log("Agregando Productos instantancia ProductManagerA");
ProductManagerA.addProduct("ProductManagerA1","descripcion producto1",10,"Sin Imagen",10,1234)
ProductManagerA.addProduct("ProductManagerA2","descripcion producto1",10,"Sin Imagen",10,1235)

/*Listar Productos creados*/
        
console.log(`lista de Productos instancia ProductManagerA: `);
ProductManagerA.getProducts();

/* const ProductManagerB = new ProductManager(path.join(__dirname, "ProductManagerB.json"));

console.log("Agregando Productos instantancia ProductManagerB");

ProductManagerB.addProduct("ProductManagerB1","descripcion producto2",200,"Sin Imagen",20,4321)
ProductManagerB.addProduct("ProductManagerB1","descripcion producto2",200,"Sin Imagen",20,4325)
ProductManagerB.addProduct("ProductManagerB2","descripcion producto2",200,"Sin Imagen",20,5321) */
        
/*Variable para buscar productos*/
const productobuscado1=2;
console.log(`informacion Producto id ${productobuscado1}: en instancia ProductManagerA`);
ProductManagerA.getProductById(productobuscado1);


        
/*Variable para Update productos*/
/* const productobuscado2=2;
const updatecampo2="price";
const updateprice2=2200;
console.log(`update db en precio ${updateprice2} al producto con ID ${productobuscado2}: en instancia ProductManagerB`);
ProductManagerB.updateProduct(productobuscado2, updatecampo2, updateprice2); */
        

/*Variable para Update productos*/
const productobuscado3=3;
const updatecampo3="stock";
const updateprice3=321;
console.log(`update db en precio ${updateprice3} al producto con ID ${productobuscado3}: en instancia ProductManagerA`);
ProductManagerA.updateProduct(productobuscado3, updatecampo3, updateprice3);


/*Variable para Eliminar productos*/
const productobuscado4=2;
console.log(`Eliminar el producto con ID ${productobuscado4}: en instancia ProductManagerA, Objeto eliminado:`);
ProductManagerA.deleteProduct(productobuscado4);
console.log(`lista de ProductosA: `);
ProductManagerA.getProducts();


        