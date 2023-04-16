const jwt = require("jsonwebtoken");
const { SECRET_JWT_ENV } = require("../config/config");

const SECRET_JWT = SECRET_JWT_ENV;

const generateJWT = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ user }, SECRET_JWT, { expiresIn: "30m" }, (err, token) => {
      if (err) {
        console.log(err);
        reject("can not generate jwt token");
      }
      resolve(token);
    });
  });
};

module.exports = {
  generateJWT,
  SECRET_JWT,
};