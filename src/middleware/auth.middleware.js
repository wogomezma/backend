const passport = require("passport");



/* const authMdw = (req, res, next) => {
    console.log("REVISANDO LA SESION**", req.session);
    if (req.session?.user) {
      return next();
    }
  
    return res.redirect(`/api/v1/views/login`);
  };
   */

  const checkAuthJwt = (strategy) => {
    return async (req, res, next) => {
      passport.authenticate(strategy, (err, user, info) => {
        console.log(
          "🚀 ~ file: auth-jwt.middleware.js:6 ~ passport.authenticate ~ info:",
          info
        );
        if (err) return next(err);
        if (!user) {
          return res
            .status(401)
            .json({ message: info.messages ? info.message : info.toString() });
        }
        req.user = user;
        next();
      })(req, res, next);
    };
  };

  module.exports = checkAuthJwt;