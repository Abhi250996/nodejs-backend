const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
 const sendMail = require("../helpers/sendMail")
const userRegister = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, msg: "Errors", errors: errors.array() });
    }
    const { name, email, mobile, password } = req.body;

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        success: false,
        msg: "Email already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const imagePath = req.file ? "images/" + req.file.filename : "";

    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      image: imagePath,
    });

    const userData = await user.save();
    const msg = '<p> Hii '+name+', Please <a href= "http://localhost:3000/mail-verification?id='+userData._id+'"> Verify</a> your email.</p> '


    sendMail(email,"Message Verification",msg);
     return res.status(201).json({
      success: true,
      msg: "Registered successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      msg: error.message || "Registration failed",
    });
  }
};

module.exports = { userRegister };

// const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const db = require("../config/dbConnections");

// const randomString = require('randomstring');
// const sendMail = require("../helpers/sendMail")

// const register = (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, email, password } = req.body;

//     db.query(
//         `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(email)})`,
//         (err, result) => {
//             if (err) {
//                 return res.status(500).send({
//                     msg: "Database error",
//                     error: err,
//                 });
//             }

//             if (result && result.length) {
//                 return res.status(409).send({
//                     msg: "This email is already in use!",
//                 });
//             } else {
//                 bcrypt.hash(password, 10, (err, hash) => {
//                     if (err) {
//                         return res.status(500).send({
//                             msg: "Error hashing password",
//                             error: err,
//                         });
//                     }

//                     const query = `
//             INSERT INTO users (name, email, password)
//             VALUES (${db.escape(name)}, ${db.escape(email)}, ${db.escape(hash)})
//           `;

//                     db.query(query, (err, result) => {
//                         if (err) {
//                             return res.status(500).send({
//                                 msg: "Error inserting user into database",
//                                 error: err,
//                             });
//                         }

//                         let mailSubject = "Mail Verification";
//                         const randomToken = randomString.generate();

//                         let content = '<p> Hii ' + req.body.name + ',\
//             Please <a href = "http://127.0.0.1:3000/mail-verification?token='+ randomToken + '"> Verify</a> your Mail';
//                         sendMail(req.body.email, mailSubject, content);

//                         db.query("UPDATE users set token=? where email=?", [randomToken, req.body.email], function (error, result, fields) {
//                             if (error) {

//                                 return res.status(400).send({
//                                     msg: err
//                                 });
//                             }
//                         });
//                         return res.status(200).send({
//                             msg: "The user has been registered successfully!",
//                         });
//                     });
//                 });
//             }
//         }
//     );
// };

// module.exports = {
//     register,
// };
