const express = require("express");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router.get(
  "/users",
  authMiddleware.authMiddleware,
  adminMiddleware.adminMiddleware,
  adminController.getAllUsers
);
router.patch(
  "/user/:id/ban",
  authMiddleware.authMiddleware,
  adminMiddleware.adminMiddleware,
  adminController.banUser
);
router.delete(
  "/user/:id",
  authMiddleware.authMiddleware,
  adminMiddleware.adminMiddleware,
  adminController.deleteUser
);
router.get(
  "/stats",
  authMiddleware.authMiddleware,
  adminMiddleware.adminMiddleware,
  adminController.getStats
);

router.get(
  "/movies",
  authMiddleware.authMiddleware,
  adminMiddleware.adminMiddleware,
  adminController.getAdminMovies
);
router.post(
  "/movies",
  authMiddleware.authMiddleware,
  adminMiddleware.adminMiddleware,
  adminController.addAdminMovie
);
router.put(
  "/movies/:id",
  authMiddleware.authMiddleware,
  adminMiddleware.adminMiddleware,
  adminController.updateAdminMovie
);
router.delete(
  "/movies/:id",
  authMiddleware.authMiddleware,
  adminMiddleware.adminMiddleware,
  adminController.deleteAdminMovie
);

module.exports = router;
