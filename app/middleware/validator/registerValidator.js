const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

// internal imports
const User = require("../../model/userModel");

const registerValidation = [
    check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .trim(),

    check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
        try {
            const user = await User.findOne({ email: value });
            if (user) {
                throw createError("Email already is use!");
            }
        } catch (err) {
            throw createError(err.message);
        }
    }),

    check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
];

const registerValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        res.status(200).json({
            data: {
                email: req.body.email,
            },
            errors: mappedErrors,
        });
    }
};

module.exports = {
    registerValidation,
    registerValidationHandler,
};
