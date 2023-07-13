const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;

    // Determinar la carpeta de destino en función del tipo de archivo
    if (req.body.type === "profile") {
      folder = "profiles";
    } else if (req.body.type === "product") {
      folder = "products";
    } else if (req.body.type === "document") {
      folder = "documents";
    } else {
      return cb(new Error("Invalid file type"));
    }

    cb(null, `uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    const userId = req.params.uid;
    cb(null, `${userId}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
