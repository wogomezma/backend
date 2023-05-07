const { Router } = require("express");
const nodemailer = require("nodemailer");
const ProductsManager = require("../services/products.service");
const { EMAIL, PSW_EMAIL } = require("../config/config");


const transporter = nodemailer.createTransport({
    host: "mail.wgomez.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PSW_EMAIL,
    },
  });
  
  

class EmailRoutes {
    path = "/email";
    router = Router();
    productsManager = new ProductsManager();
  
    constructor() {
      this.initEmailRoutes();
    }

      // Define la función sendEmail
  async sendEmail(emailOptions) {
    try {
      const result = await transporter.sendMail(emailOptions);
      return result;
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw error;
    }
  }
  
    initEmailRoutes() {
  

          

this.router.post(`${this.path}/send`, async (req, res) => {
 
  try {
    
    let result = await transporter.sendMail({
      from: EMAIL,
      to: req.body.email,
      subject: "sending email with nodemail",
      html: `
      <!DOCTYPE html>
<html>
  <head>
    <title>Correo electrónico de prueba</title>
    <style>
      /* Estilos para la sección de cabecera */
      .header {
        background-color: #FCDD09;
        color: #002868;
        padding: 20px;
        text-align: center;
      }

      /* Estilos para la sección de contenido */
      .content {
        background-color: #FFFFFF;
        color: #000000;
        padding: 20px;
        text-align: justify;
      }

      /* Estilos para la imagen */
      img {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
      }

      /* Estilos para el enlace */
      a {
        color: #FCDD09;
        text-decoration: none;
      }

      /* Estilos para el botón */
      .button {
        background-color: #002868;
        border-radius: 5px;
        color: #FCDD09;
        display: block;
        margin: 20px auto;
        padding: 10px;
        text-align: center;
        width: 200px;
      }
    </style>
  </head>
  <body>
    <!-- Sección de cabecera -->
    <div class="header">
      <img src="https://via.placeholder.com/150x150.png?text=Logo" alt="Logo">
      <h1>Correo electrónico de prueba</h1>
      <p>Este es un correo electrónico de prueba enviado desde una aplicación en Node.js con Nodemailer.</p>
    </div>

    <!-- Sección de contenido -->
    <div class="content">
      <p>¡Hola!</p>
      <p>Este correo electrónico es solo una prueba. Espero que lo hayas recibido sin problemas.</p>
      <img src="https://via.placeholder.com/350x150.png?text=Imagen" alt="Imagen">
      <p>Si tienes alguna pregunta o comentario, no dudes en ponerte en contacto con nosotros.</p>
      <p>Gracias por tu atención.</p>
      <a href="#">Enlace a nuestro sitio web</a>
      <br>
      <a href="#">Enlace a nuestro perfil en redes sociales</a>
      <br>
      <a href="#">Enlace a nuestra página de contacto</a>
      <br>
      <br>
      <div class="button">
        <a href="#">Botón</a>
      </div>
    </div>
  </body>
</html>

      `,
    });
    console.log(
      "🚀 ~ file: email.routes.js:45 ~ router.post ~ result:",
      result
    );
       
   return res.send({ ok: true, result: `email send to ${req.body.email}` });
  } catch (error) {
    console.log("🚀 ~ file: email.routes.js:47 ~ router.post ~ error:", error);
  }
});

}
}


module.exports = EmailRoutes;