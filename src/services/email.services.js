const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { SECRET_JWT, EMAIL, PSW_EMAIL } = require("../config/config");
const { userModel, findUserByEmail } = require('../models/user.model');
const { createHashValue, isValidPasswd } = require("../utils/encrypt");
const { generateJWT } = require("../utils/jwt")



const transporter = nodemailer.createTransport({
  host: "mail.wgomez.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: PSW_EMAIL,
  },
});

class EmailService {



  async sendPasswordResetEmail(email) {

    const User = await userModel.findOne({ email })
  
    const signUser = {
        email: User.email,
        rol: User.rol,
      };

      const token = await generateJWT({ ...signUser });


    console.log("🚀 ~ file: email.services.js:25 ~ EmailService ~ sendPasswordResetEmail ~ email:", User)
    console.log("🚀 ~ file: email.services.js:25 ~ EmailService ~ sendPasswordResetEmail ~ token:", token)

    const emailOptions = {
      from: EMAIL,
      to: email,
      subject: "Recuperación de contraseña",
      html: `
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="http://localhost:8080/api/v1/views/recover?token=${token}">Restablecer contraseña</a>
      `,
    };
    console.log("🚀 ~ file: email.services.js:37 ~ EmailService ~ sendPasswordResetEmail ~ emailOptions:", emailOptions)

    try {
      const result = await transporter.sendMail(emailOptions);
      return result;
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw error;
    }
  }

  isSamePassword(password, userPassword) {
    return password === userPassword;
  }

  async resetPassword(email, newPassword) {
    try {
      // Buscar el usuario por su dirección de correo electrónico
      const user = await userModel.findOne({ email });

      // Verificar si el usuario existe
      if (!user) {
        throw new Error("User not found");
      }


      // Actualizar la contraseña del usuario con el nuevo valor
      const hashedPassword = await createHashValue(newPassword);
      user.password = hashedPassword;

      // Guardar los cambios en la base de datos
      await user.save();

      return { success: true, message: "Password reset successful" };
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }

  sendEmail(emailOptions) {
    return transporter.sendMail(emailOptions);
  }


}

module.exports = EmailService;
