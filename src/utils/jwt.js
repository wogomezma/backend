const jwt = require("jsonwebtoken");
const { SECRET_JWT_ENV } = require("../config/config");

const SECRET_JWT = SECRET_JWT_ENV;

const generateJWT = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ user }, SECRET_JWT, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.error(err);
        reject("Error al generar el token JWT");
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = {
  generateJWT,
  SECRET_JWT,
};