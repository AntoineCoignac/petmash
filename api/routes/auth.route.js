const express = require("express");
const authController = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/register", authController.register)
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/isloggedin", authController.isLoggedIn);

module.exports = router;