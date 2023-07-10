const { userModel, findUserByEmail } = require('../models/user.model');
const cartsModel = require("../models/carts.model");
const { generateJWT } = require("../utils/jwt");
const { createHashValue, isValidPasswd } = require("../utils/encrypt");
const { EnumErrors, HttpResponses } = require("../middleware/error-handle");

const httpResp = new HttpResponses();

class UserManager {
  constructor() {}

  getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find({});

      return users;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  getUserById = async (req, res) => {
    try {

      const user = await userModel.findById({ _id: req.params.userId });
      return user;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };



  createUser = async (req, res) => {
    try {
        console.log("BODY Service****", req.body);
   
        const { name, lastname, email, password, rol="user" } = req.body;
        const pswHashed = await createHashValue(password);
        console.log("🚀 ~ file: user.service.js:31 ~ UserManager ~ createUser= ~ pswHashed:", pswHashed)
        var titlecart = 'Carts of ' + email
        var descriptioncart = 'Carts of ' + name;
        const newCartsdata = { title: titlecart, description: descriptioncart, category: "CartsUser"};
        const newCarts = await cartsModel.create(newCartsdata);
        const userAdd = { name, lastname, email, password: pswHashed, rol, cart: newCarts._id };
        console.log("🚀 ~ file: user.service.js:42 ~ UserManager ~ createUser= ~ newCarts:", newCarts)
        const newUser = await userModel.create(userAdd);
        console.log("🚀 ~ file: user.service.js:35 ~ UserManager ~ createUser= ~ newUser:", newUser)
        req.session.user = { email, name, lastname, rol };
        return newUser;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
        const deleteUserById = await userModel.deleteOne({ _id: req.params.userId });
        return deleteUserById;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      const { name, lastname, password } = req.body;
  
      const hashedPassword = await createHashValue(password);
  
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.userId,
        { $set: { name, lastname, password: hashedPassword } },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        throw new Error("User not found");
      }
  
      return updatedUser;
    } catch (error) {
      console.log(
        "🚀 ~ file: users.manager.js ~ UsersManager ~ updateUser= ~ error:",
        error
      );
    }
  };



  updateRol = async (user) => {
    console.log("🚀 ~ file: user.service.js:94 ~ updateRol= ~ user:", user)
    try {
      // Cambiar el rol del usuario
      if (user.rol === "premium") {
        
        user.rol = "user";
        console.log("🚀 ~ file: user.service.js:101 ~ UserCtrl ~ changeToPremium= ~ user.role:", user.rol);
      } else if (user.rol === "user") {
        user.rol = "premium";
        console.log("🚀 ~ file: user.service.js:104 ~ UserCtrl ~ changeToPremium= ~ user.role:", user.rol);
      }

      const { _id, name, lastname, password, rol } = user;
  
      console.log("🚀 ~ file: user.service.js:97 ~ updateRol= ~ user:", user)
      const updatedUser = await userModel.findByIdAndUpdate(
        _id,
        { $set: { name, lastname, password, rol } },
        { new: true, runValidators: true }
      );
      console.log("🚀 ~ file: user.service.js:106 ~ updateRol= ~ updatedUser:", updatedUser);
  
      if (!updatedUser) {
        throw new Error("User not found");
      }
  
      return updatedUser;
    } catch (error) {
      console.log("🚀 ~ file: users.manager.js ~ UsersManager ~ updateUser= ~ error:", error);
    }
  };
  
  

  resetPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Buscar el usuario por su dirección de correo electrónico
      const user = await userModel.findOne({ email });
  
      // Verificar si el usuario existe
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const hashedPassword = await createHashValue(password);

      // Actualizar la contraseña del usuario con el valor proporcionado
      user.password = await createHashValue(hashedPassword);
  
      // Guardar los cambios en la base de datos
      await user.save();
  
      return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({ message: error.message });
    }
  };



  

  uploadDocuments = async (req, res) => {
    try {
      const userId = req.params.uid;
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Configuración de Multer para guardar los archivos subidos
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "uploads/");
        },
        filename: (req, file, cb) => {
          cb(null, `${userId}-${file.originalname}`);
        },
      });

      const upload = multer({ storage }).array("documents", 5); // Se permite subir hasta 5 documentos

      upload(req, res, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error uploading files" });
        }

        const files = req.files;
        const uploadedDocuments = [];

        // Guardar los nombres de los archivos en el usuario y marcarlos como subidos
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



  
  
  
module.exports = UserManager;