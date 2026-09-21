const express = require("express");

const {
    submitAnswer,
} = require("../controllers/attemptController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    submitAnswer
);

module.exports = router;