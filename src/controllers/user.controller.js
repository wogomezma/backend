const UserManager = require("../services/user.service");
const UsersMenManager = require("../services/user-men.service");
const { userModel, findUserByEmail } = require('../models/user.model');
const { EnumErrors, HttpResponses } = require("../middleware/error-handle");
const multer = require('multer');
const upload = require("../middleware/multer");


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
      console.log("🚀 ~ file: user.controller.js:15 ~ UserCtrl ~ getAllUsers= ~ users:", users)
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


      if (!req.params.userId || isNaN(req.params.userId) || req.params.userId < 0) {
        return httpResp.BadRequest(
          res,
          `${EnumErrors.INVALID_PARAMS} - Invalid Params for userId `
        );
      }

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
  
      const requiredDocuments = ["identification", "proofOfAddress", "bankStatement"];
  
      for (const document of requiredDocuments) {
        if (!user.documents.includes(document)) {
          return res.status(400).json({
            message: `User has not uploaded the required document: ${document}`,
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

      const uploadMiddleware = upload.array("documents", 5);


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
            reference: file.filename,
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