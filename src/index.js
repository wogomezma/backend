const App = require("./app.jsold");
const BaseRoute = require("./routes/base.routes");
const CartsRoutes = require("./routes/carts.routes");
const ProductsRoutes = require("./routes/products.routes.jsold");
const viewsRoutes = require("./routes/views.routes");

const app = new App([
  new BaseRoute(),
  new CartsRoutes(),
  new ProductsRoutes(),
  new viewsRoutes(),
]);

app.listen();