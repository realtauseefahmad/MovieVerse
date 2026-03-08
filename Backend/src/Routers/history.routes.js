const express = require("express")
const historyController = require("../controllers/history.controller")
const authMiddleware = require("../middlewares/auth.middleware")





const router = express.Router()

router.post("/", authMiddleware.authMiddleware, historyController.addToHistory)

router.get("/", authMiddleware.authMiddleware, historyController.getHistory)




module.exports = router