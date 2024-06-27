const express = require('express');
const imageController = require('../controllers/image.controller.js');
const verifyToken = require('../middleware/jwt.js');

const router = express.Router();

router.get("/", verifyToken, imageController.getRandomImages);
router.get("/leaderboard", verifyToken, imageController.getLeaderboard);
router.put("/vote", verifyToken, imageController.vote);
router.post("/new", imageController.newImage);

module.exports = router;