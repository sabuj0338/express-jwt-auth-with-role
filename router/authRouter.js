const express = require("express");

const {loginValidation, loginValidationHandler} = require("../app/middleware/validator/loginValidator");
const {registerValidation, registerValidationHandler} = require("../app/middleware/validator/registerValidator");
const avatarUploadValidator = require("../app/middleware/validator/avatarUploadValidator");
const {authenticationMiddleware} = require("../app/middleware/authenticationMiddleware");

const {login, register, me} = require("../app/controller/authenticationController");

const router = express.Router();

// login page
router.get("/", authenticationMiddleware, me);

// request for login
router.post("/login", loginValidation, loginValidationHandler, login);
router.post("/register", avatarUploadValidator, registerValidation, registerValidationHandler, register);


module.exports = router;