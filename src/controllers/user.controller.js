const UserManager = require("../services/user.service");
const UsersMenManager = require("../services/user-men.service");
const { userModel, findUserByEmail } = require('../models/user.model');
const { EnumErrors, HttpResponses } = require("../middleware/error-handle");
const multer = require('multer');
const upload = require("../middleware/multer");
const path = require("path");
const EmailService = require("../services/email.services");


const emailService = new EmailService();
const httpResp = new HttpResponses();

class UserCtrl {
    userManager;

  constructor() {
    this.userManager = new UserManager();

    // SW a Memoria
    // this.userManager = new UsersMenManager();
  }

  getAllUsers = async (req, res) => {
    try {
      const users = await this.userManager.getAllUsers(req, res);
      return res.json({ message: `getAllUsers`, users });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getUserById = async (req, res) => {
    try {
      
      console.log("🚀 ~ file: user.controller.js:31 ~ UserCtrl ~ getUserById= ~ req.params.userId:", req.params.userId)


      // if (!req.params.userId || isNaN(req.params.userId) || req.params.userId < 0) {
      //   return httpResp.BadRequest(
      //     res,
      //     `${EnumErrors.INVALID_PARAMS} - Invalid Params for userId is 0 o menor`
      //   );
      // }


      const user = await this.userManager.getUserById(req, res);
      console.log("🚀 ~ file: user.controller.js:43 ~ UserCtrl ~ getUserById= ~ user:", user)

      
      if (!user) {
       return res.json({ message: `this users does not exist` });
      }

      return res.json({ message: `getUserById`, user });
    } catch (error) {
      return httpResp.Error(
        res,
        `${EnumErrors.DATABASE_ERROR} - ERROR DB ${error} `
      );
    }
  };


  createUser = async (req, res) => {
    try {
        console.log("BODY en Controller ****", req.body);
        const useremail = req.body.email;
        const existingUser = await findUserByEmail(useremail);
    
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
    
        const newUser = await this.userManager.createUser(req);
    
        if (!newUser) {
          return res.status(500).json({ message: "User creation failed" });
        }
    
        return res.status(201).json({
          message: `User created`,
          user: newUser,
        });
          
      } catch (error) {
        return res.status(500).json({ messagecreate: error.message });
      }
  };

  deleteUser = async (req, res) => {
    
    try {


      // if (!req.params.userId || isNaN(req.params.userId) || req.params.userId < 0) {
      //   return httpResp.BadRequest(
      //     res,
      //     `${EnumErrors.INVALID_PARAMS} - Invalid Params for userId `
      //   );
      // }

        const deleteUserById = await this.userManager.deleteUser(req, res);
        if (!deleteUserById) {
          return res.json({ message: `this users does not exist` });
        }
        return res.json({
            message: `deleteUserById with ROLE ADMIN`,
            user: deleteUserById,
          });
      } catch (error) {
        return res.status(500).json({ messagedelete: error.message });
      }
  };


  deleteInactiveUsers = async (req, res) => {
    try {
      // Calcular la fecha actual menos 30 minutos
      const thirtyMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);
  
      // Buscar los usuarios inactivos con rol "user"
      const usersToDelete = await userModel.find({
        rol: "user",
        last_connection: { $lt: thirtyMinutesAgo },
      });
  
      // Obtener los correos electrónicos de los usuarios a eliminar
      const emailsToDelete = usersToDelete.map(user => user.email);
      console.log("Usuarios a eliminar:", emailsToDelete);
  
      // Eliminar los usuarios inactivos con rol "user"
      const deletedUsers = await userModel.deleteMany({
        rol: "user",
        last_connection: { $lt: thirtyMinutesAgo },
      });
  
      // Enviar un correo electrónico a cada usuario eliminado
      for (const email of emailsToDelete) {
        console.log(`Usuario eliminado: ${email}`);
        await emailService.sendEmail({
          from: "pruebascoder@wgomez.com",
          to: email,
          subject: "Cuenta eliminada por inactividad",
          text: `Tu cuenta (${email}) ha sido eliminada debido a la inactividad en los últimos 2 dias.`,
        });
      }
  
      return res.json({ message: "Usuarios inactivos eliminados correctamente" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  


  updateUser = async (req, res) => {
    try {
      const updatedUser = await this.userManager.updateUser(req, res);

      if (!req.params.userId || isNaN(req.params.userId) || req.params.userId < 0) {
        return httpResp.BadRequest(
          res,
          `${EnumErrors.INVALID_PARAMS} - Invalid Params for userId `
        );
      }
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({ messageupdateuser: error.message });
    }
  };
  
  changeToPremium = async (req, res) => {
    try {
      const userId = req.params.userId;
  

      // Verificar si el usuario ha cargado los documentos requeridos
      const user = await this.userManager.getUserById(req, res);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.rol === 'admin') {
        return res.status(403).json({ message: 'El cambio de rol solo es posible de user a premium' });
      }

      const requiredDocuments = ["identification", "proofOfAddress", "bankStatement"];
  
      for (const documentName of requiredDocuments) {
        // Obtener el nombre del documento sin la extensión
        const documentNameWithoutExtension = documentName.split(".")[0];

  
        // Verificar si el usuario ha cargado el documento requerido
        const document = user.documents.find(doc => doc.name.split(".")[0] === documentNameWithoutExtension);
        
        if (!document) {
          return res.status(400).json({
            message: `El usuario no ha subido el documento requerido: ${documentName}`,
          });
        }
      }
  
      // Verificar si el usuario ya es premium
      if (user.rol === "premium") {
        return res.status(400).json({ message: "User is already a premium member" });
      }
  
      // Actualizar el rol del usuario a premium
      const updatedUser = await this.userManager.updateRol(user);
      return res.status(200).json({
        message: "User role updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({ message: "Error updating user role", error });
    }
  };

  

  
 

  uploadDocuments = async (req, res) => {
    try {
      const userId = req.params.uid;
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const uploadMiddleware = upload.array("documents", 11);


      uploadMiddleware(req, res, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error uploading files" });
        }
      
        const files = req.files;
        const uploadedDocuments = [];
      
        files.forEach((file) => {
          const document = {
            name: file.originalname,
            reference: path.join(file.destination, file.filename),
            status: "uploaded",
          };
          user.documents.push(document);
          uploadedDocuments.push(document);
        });

        await user.save();

        return res.status(200).json({
          message: "Documents uploaded successfully",
          documents: uploadedDocuments,
        });
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({ message: error.message });
    }
  };
}

module.exports = UserCtrl;