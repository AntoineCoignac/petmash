const express = require('express');
const userController = require('../controllers/user.controller.js');
const verifyToken = require('../middleware/jwt.js');

const router = express.Router();

router.get("/:id", verifyToken, userController.getUser);
router.put("/:id", verifyToken, userController.updateUser);

module.exports = router;