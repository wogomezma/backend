const App = require("./app");
const BaseRoute = require("./routes/base.routes");
const CartsRoutes = require("./routes/cart.routes");
const ProductsRoutes = require("./routes/products.routes");
const viewsRoutes = require("./routes/views.routes");
const SessionRoutes = require("./routes/session.routes");
const usersRoutes = require("./routes/user.routes");
const ticketsRoutes = require("./routes/tickets.routes");
const EmailRoutes = require("./routes/email.routes");
const MocksRoutes = require("./routes/mocks.routes");
const ErrorsRoutes = require("./routes/error.routes");
const DocsRoutes = require("./routes/docs.router");


const app = new App([
  new BaseRoute(),
  new CartsRoutes(),
  new ProductsRoutes(),
  new viewsRoutes(),
  new SessionRoutes(),
  new usersRoutes(),
  new ticketsRoutes(),
  new EmailRoutes(),
  new MocksRoutes(),
  new ErrorsRoutes(),
  new DocsRoutes()
]);

app.listen();