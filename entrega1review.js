class ProductManager {

    static id = 0;

    constructor() { this.products = [] }
    
    getProducts() {return console.log(this.products);}

    getProductById(id){
  
             /* Funcion para buscar ID*/
    const findElement = (array, searchedID) => {
        return array.find(element => element.id === searchedID) ?? "error no encuentra el producto";
      }
      
      const idbuscado = findElement(this.products, id)
      return console.log(idbuscado);

    }

    addProduct(title,description,price,thumbnail,stock,code) {


         /* Funcion para buscar code repetido*/
    const findElement = (array, searchedCode) => {
        return array.find(element => element.code === searchedCode) ?? false;
      }
      
      const coderepetido = findElement(this.products, code)

    if (coderepetido == false) {
       
        /* ID Incremental */
        ProductManager.id = ProductManager.id + 1;
        const id = ProductManager.id
        /* Agrega Producto */
        this.products.push({id,title,description,price,thumbnail,stock,code});
        
      } else {
        console.log("Code repetido, favor cambiarlo");
 
      }




  

      }
        
    }

    /**Creacion Instancias */
    const ProductManagerA = new ProductManager();
    const ProductManagerB = new ProductManager();

    /*Listar Productos sin crear*/
console.log(`lista de Productos: `);
ProductManagerA.getProducts();
    
    console.log("Agregando Productos instantancia ProductManagerA");
    ProductManagerA.addProduct("ProductManagerA1","descripcion producto1",10,"Sin Imagen",10,1234)
    ProductManagerA.addProduct("ProductManagerA2","descripcion producto1",10,"Sin Imagen",10,1235)



/*Listar Productos creados*/
console.log(`lista de Productos instancia ProductManagerA:`);
ProductManagerA.getProducts();

console.log("Agregando Productos instantancia ProductManagerB");

ProductManagerB.addProduct("ProductManagerB1","descripcion producto2",200,"Sin Imagen",20,4321)
ProductManagerB.addProduct("ProductManagerB2","descripcion producto2",200,"Sin Imagen",20,5321)

        /*Listar Productos creados*/
console.log(`lista de Productos instancia ProductManagerB: `);
ProductManagerB.getProducts();

/*Variable para buscar productos*/
const productobuscado1=3;
console.log(`informacion Producto id ${productobuscado1}: en instancia ProductManagerA`);
ProductManagerA.getProductById(productobuscado1);

/*Variable para buscar productos*/
const productobuscado2=3;
console.log(`informacion Producto id ${productobuscado2}: en instancia ProductManagerB`);
ProductManagerB.getProductById(productobuscado2);
