const express = require("express");

const {
    loginValidation,
    loginValidationHandler,
    registerValidation,
    registerValidationHandler
} = require("../app/middleware/validator/authValidator");
const avatarUploadValidator = require("../app/middleware/validator/avatarUploadValidator");
const {verifyAuthMiddleware} = require("../app/middleware/verifyAuthMiddleware");

const {login, register, me, sendCode, verify} = require("../app/controller/authenticationController");
const Role = require("../app/utilities/role");

const router = express.Router();

// auth routes
router.post("/login", loginValidation, loginValidationHandler, login);
router.post("/register", avatarUploadValidator, registerValidation, registerValidationHandler, register);

router.get("/", verifyAuthMiddleware(Role.all, false), me);

router.post("/send-verification-code", verifyAuthMiddleware(Role.all, false), sendCode);
router.post("/verify", verifyAuthMiddleware(Role.all, false), verify);
// router.post("/profile-update", verifyAuthMiddleware(Role.all, false), verify);
// router.post("/forgot-password", registerValidation, registerValidationHandler, register);


module.exports = router;