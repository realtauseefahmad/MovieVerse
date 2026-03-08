const express = require("express")
const adminController = require("../controllers/admin.controller")

const authMiddleware = require("../middlewares/auth.middleware")
const adminMiddleware = require("../middlewares/admin.middleware")

const router = express.Router()


router.get(
    "/users",
    authMiddleware.authMiddleware,
    adminMiddleware.adminMiddleware,
    adminController.getAllUsers
)


router.delete(
    "/user/:id",
    authMiddleware.authMiddleware,
    adminMiddleware.adminMiddleware,
    adminController.deleteUser
)


router.get(
    "/stats",
    authMiddleware.authMiddleware,
    adminMiddleware.adminMiddleware,
    adminController.getStats
)

module.exports = router