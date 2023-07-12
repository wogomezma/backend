const passport = require("passport");
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
global.localStorage = localStorage;


function handlePolicies(policies) {
  return (req, res, next) => {
    // Verificar si la única política es "PUBLIC"
    if (policies.length === 1 && policies[0] === "public") {
      return next();
    }


    const token = localStorage.getItem('token');
    console.log("🚀 ~ file: handle-policies.middleware.js:16 ~ return ~ token:", token)
    
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    
    console.log("🚀 ~ file: handle-policies.middleware.js:19 ~ return ~ req.headers.authorization:", req.headers.authorization)

    // Usar Passport para autenticar al usuario y verificar el rol
    passport.authenticate("jwt", { session: false }, (err, userJWT, info) => {
      console.log(
        "🚀 ~ file: handle-policies.middleware.js:12 ~ passport.authenticate ~ userJWT:",
        userJWT
      );
      if (err) {
        return next(err);
      }
      if (!userJWT) {
        return res
          .status(401)
          .send({ message: "Acceso denegado. Token inválido o expirado." });
      }
      if (policies.includes(userJWT.user.rol)) {
        
        req.user = userJWT;
        
        return next();
      } else {
        return res
          .status(403)
          .send({ message: "Acceso denegado. Rol del usuario no autorizado." });
      }
    })(req, res, next);
  };
}

module.exports = handlePolicies;