const { body, validationResult } = require("express-validator");
const User = require("../models/user.model");


const registerValidationRules = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 20 }).withMessage("Username must be 3-20 characters long")
        .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$/)
        .withMessage("Username must contain at least one letter and can only contain letters, numbers, and underscores")
        .custom(async (username) => {
            const user = await User.findOne({ username });
            if (user) {
                return Promise.reject("Username already exists");
            }
        }),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email address")
        .normalizeEmail()
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                return Promise.reject("Email already exists");
            }
        }),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character"),
];

const validateRegister = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
        });
    }
    next();
};

module.exports = {
    registerValidationRules,
    validateRegister
};