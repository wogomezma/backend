const rolMdw = (req, res, next) => {
    console.log("REVISANDO ROL**", req.session.user._doc.rol);
    if (req.session.user._doc.rol==='admin') {
      console.log("🚀 ~ file: rol.middleware.js:4 ~ rolMdw ~ req.session.user._doc.rol:", req.session.user._doc.rol)
      return next();
    }
    console.log("Rol sin permisos de ingreso");
    return res.redirect(`/api/v1/views/products`);
  };
  
  module.exports = rolMdw;