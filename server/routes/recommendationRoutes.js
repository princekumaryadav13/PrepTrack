const express = require("express");
const {
    getRecommendations,
    getCompanyReadiness,
} = require("../controllers/recommendationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getRecommendations);
router.get("/companies", authMiddleware, getCompanyReadiness);

module.exports = router;
