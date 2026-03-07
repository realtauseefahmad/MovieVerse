const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router();


/**
 * @route POST /auth/register
 * @desc Register a new user
 */
router.post("/register",authController.userRegister);


/**
 * @route POST /auth/login
 * @desc Login a user
 */
router.post("/login",authController.userLogin);

/**
 * - Get /auth/profile
 */
router.get("/profile", authMiddleware.authMiddleware , authController.getProfile)

module.exports = router;