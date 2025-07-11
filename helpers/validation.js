const { check } = require("express-validator");

exports.signupValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please enter a vaild mail")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("mobile", "Mobile no should not be less then 10 digits").isLength({
    max: 10,
    min: 10,
  }),
  check(
    "password",
    "Password must be greate then 6 characters, must containss atleast one uppercase , one lowercase, one number and one special character"
  ).isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  }),
  check('image').custom((value,{req})=>{
    if(req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/png")
    {
        return true;
    }
    else{
        return false;   
    }
  }).withMessage("Please Upload an image jpeg,Png format only")
];
