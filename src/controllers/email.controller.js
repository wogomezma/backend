const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const EmailService = require("../services/email.services");
const { SECRET_JWT_ENV } = require("../config/config");
const { userModel, findUserByEmail } = require('../models/user.model');
const { createHashValue, isValidPasswd } = require("../utils/encrypt");


const emailService = new EmailService();


const SECRET_JWT = SECRET_JWT_ENV;


class EmailController {
//   constructor() {
//     this.emailService = new EmailService();
//   }

//   generateJWT(user) {
//     return jwt.sign({ user }, SECRET_JWT, { expiresIn: "1h" });
//   }

  async sendResetEmail(req, res) {
    const { email } = req.body;

    try {
      // Verificar si el usuario existe en la base de datos
      const user = await userModel.findOne({ email });
           console.log("🚀 ~ file: email.controller.js:31 ~ EmailController ~ sendResetEmail ~ email:", email)
      

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      console.log("🚀 ~ file: email.controller.js:35 ~ EmailController ~ sendResetEmail ~ user:", user)

    
      // Enviar correo electrónico de restablecimiento de contraseña
      await emailService.sendPasswordResetEmail(email);
      console.log("🚀 ~ file: email.controller.js:55 ~ EmailController ~ sendResetEmail ~ email:", email)

      return res.json({ message: "Correo de restablecimiento enviado" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al enviar el correo de restablecimiento" });
    }
  }

  async resetPassword(req, res) {
    const { token, new_password } = req.body;
    console.log("🚀 ~ file: email.controller.js:52 ~ EmailController ~ resetPassword ~ req.body:", req.body)
    console.log("🚀 ~ file: email.controller.js:52 ~ EmailController ~ resetPassword ~ newPassword:", new_password)
    console.log("🚀 ~ file: email.controller.js:52 ~ EmailController ~ resetPassword ~ token:", token)

    try {
      // Verificar y decodificar el token JWT
      const decodedToken = jwt.verify(token, SECRET_JWT);

      // Verificar si el token ha expirado
      if (decodedToken.exp < Date.now() / 1000) {
        return res.render("sendrecovery");
      }

      const { email } = decodedToken.user;

//  Verificar si se está tratando de restablecer la contraseña con la misma contraseña del usuario
const user = await userModel.findOne({ email });
const isValidComparePsw = await isValidPasswd(new_password, user.password);
console.log("🚀 ~ file: email.services.js:74 ~ EmailService ~ resetPassword ~ isValidComparePsw:", isValidComparePsw)

if (isValidComparePsw) {
    return res.status(400).json({ error: "No puedes utilizar la misma contraseña" });
  }


      // Restablecer la contraseña
      await emailService.resetPassword(email, new_password);

      return res.json({ message: "Contraseña restablecida exitosamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al restablecer la contraseña" });
    }
  }
}

module.exports = EmailController;
