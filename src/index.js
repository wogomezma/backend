const App = require("./app");
const BaseRoute = require("./routes/base.routes");
const CartsRoutes = require("./routes/cart.routes");
const ProductsRoutes = require("./routes/products.routes");
const viewsRoutes = require("./routes/views.routes");
const SessionRoutes = require("./routes/session.routes");

const app = new App([
  new BaseRoute(),
  new CartsRoutes(),
  new ProductsRoutes(),
  new viewsRoutes(),
  new SessionRoutes(),
]);

app.listen();