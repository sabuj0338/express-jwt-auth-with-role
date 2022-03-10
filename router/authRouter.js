const express = require("express");

const {
    loginValidation,
    loginValidationHandler,
    registerValidation,
    registerValidationHandler,
    emailValidation,
    emailValidationHandler
} = require("../app/middleware/validator/authValidator");
const avatarUploadValidator = require("../app/middleware/validator/avatarUploadValidator");
const {authenticationMiddleware} = require("../app/middleware/authenticationMiddleware");

const {
    login,
    register,
    me,
    emailVerification,
    verify,
    verifyEmail,
    forgotPassword,
    updatePassword,
    updateProfile
} = require("../app/controller/authenticationController");

const Role = require("../app/utilities/role");

const router = express.Router();

// auth routes
router.post("/login", loginValidation, loginValidationHandler, login);
router.post("/register", avatarUploadValidator, registerValidation, registerValidationHandler, register);

router.get("/", authenticationMiddleware(Role.all, false), me);

router.post("/send-verification-code", authenticationMiddleware(Role.all, false), emailVerification);
router.post("/verify", authenticationMiddleware(Role.all, false), verify);

router.post("/forgot-password", emailValidation, emailValidationHandler, forgotPassword);
router.post("/verify", verifyEmail);
router.post("/update-password", emailValidation, emailValidationHandler, updatePassword);

router.post("/update-profile", authenticationMiddleware(Role.all, false), updateProfile);

module.exports = router;