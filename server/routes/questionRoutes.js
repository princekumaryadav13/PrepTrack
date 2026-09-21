const express = require("express");

const {
    createQuestion,
    getQuestions,
    getQuestionById,
    getAdminQuestions,
    updateQuestion,
    deleteQuestion,
} = require("../controllers/questionController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin: Get all questions with answers & details
router.get(
    "/admin/all",
    authMiddleware,
    authorizeRoles("admin"),
    getAdminQuestions
);

// Admin: Create question
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createQuestion
);

// Student/Admin: Get paginated/filtered questions (no answers exposed)
router.get(
    "/",
    authMiddleware,
    getQuestions
);

// Student/Admin: Get single question
router.get(
    "/:id",
    authMiddleware,
    getQuestionById
);

// Admin: Update question
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateQuestion
);

// Admin: Delete question
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteQuestion
);

module.exports = router;