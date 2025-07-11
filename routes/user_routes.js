const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, path.join(__dirname, "../public/images"));
    }
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jped") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Controller
const userController = require("../controllers/user_controller");

// Routes

const {signupValidation} = require("../helpers/validation")
router.post("/register", upload.single("image"),signupValidation, userController.userRegister);

module.exports = router;
