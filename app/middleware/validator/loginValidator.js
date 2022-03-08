const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const loginValidation = [
    check("email")
    .isLength({
      min: 1,
    })
    .withMessage("Email is required"),

    check("password")
    .isLength({ min: 1 })
    .withMessage("Password is required"),
];

const loginValidationHandler = function (req, res, next) {
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
    loginValidation,
    loginValidationHandler,
};
