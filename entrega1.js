class ProductManager {
    static id = 0;
    static products = [];

  constructor(title,description,code,price,thumbnail,stock) {
    this.title = title;
    this.description = description;
    this.code = code;
    this.products = ProductManager.id++;
    this.price = price;
    this.thumbnail = thumbnail;
    this.stock = stock;

}

getProducts = () => {
 return console.log(ProductManager.products);
  }


  addProduct(title,description,code,price,thumbnail,stock){

    /* Funcion para buscar code repetido*/
    const findElement = (array, searchedCode) => {
        return array.find(element => element.code === searchedCode) ?? false;
      }
      
      const coderepetido = findElement(ProductManager.products, code)

    if (coderepetido == false) {
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.thumbnail = thumbnail;
        this.stock = stock;
        ProductManager.products.push({id: ProductManager.id,title,code,price,thumbnail,stock});
        
      } else {
        console.log("Code repetido, favor cambiarlo");
 
      }

  }
  
  getProductsbyid = (id) => {
    return (ProductManager.products[id]==null? console.log("error no encuentra el producto") : console.log(ProductManager.products[id]))
 

}
}

console.log(`Numero de Productos: ${ProductManager.id}`);


/* Creacion de Productos */
console.log("Agregando producto1");
const producto1 = new ProductManager();
producto1.addProduct("producto1","descripcion producto1",1234,100,"Sin Imagen",10)
console.log(`Numero de Productos: ${ProductManager.id}`);


/*Listar Productos creados*/
console.log(`lista de Productos: `);
producto1.getProducts();

/*Variable para buscar productos*/
const productobuscado=0;
console.log(`informacion Producto id ${productobuscado}:`);
producto1.getProductsbyid(productobuscado);

/* Se agrega producto 2, si el code esta repetido con el de producto 1 no lo agrega */
console.log("Agregando producto2");
const producto2 = new ProductManager();
producto2.addProduct("producto2","descripcion producto2",4321,200,"Sin Imagen",20)
console.log(`Numero de Productos: ${ProductManager.id}`);

/*Listar Productos creados*/
console.log(`lista de Productos: `);
producto1.getProducts();

/*Variable para buscar productos*/
const productobuscado2=1;
console.log(`informacion Producto id ${productobuscado2}:`);
producto1.getProductsbyid(productobuscado2);

/*Variable para buscar productos ejemplo no encontrado*/
const productobuscado3=5;
console.log(`informacion Producto id ${productobuscado3}:`);
producto1.getProductsbyid(productobuscado3);


