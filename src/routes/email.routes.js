const { Router } = require("express");
const nodemailer = require("nodemailer");
const ProductsManager = require("../services/products.service");
const { EMAIL, PSW_EMAIL } = require("../config/config");
const EmailController = require("../controllers/email.controller");
const handlePolicies = require("../middleware/handle-policies.middleware");


  
const emailCtrl = new EmailController();

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
  

          
this.router.post(`${this.path}/send-reset-email`, handlePolicies(["public"]), emailCtrl.sendResetEmail);
this.router.post(`${this.path}/reset-password`,handlePolicies(["public"]), emailCtrl.resetPassword);



}
}


module.exports = EmailRoutes;