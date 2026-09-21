const express = require("express");
const {
    createMockTest,
    getAllMockTests,
    getMockTestById,
    getAdminMockTestById,
    updateMockTest,
    deleteMockTest,
    submitMockTest,
    getMyTestAttempts,
    getTestAttemptDetails,
} = require("../controllers/testController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// List tests (student/admin)
router.get("/", authMiddleware, getAllMockTests);

// Get student's past test attempts
router.get("/attempts/my", authMiddleware, getMyTestAttempts);

// Get detailed scorecard of a test attempt
router.get("/attempts/:attemptId", authMiddleware, getTestAttemptDetails);

// Admin: Get test with answers
router.get("/:id/admin", authMiddleware, authorizeRoles("admin"), getAdminMockTestById);

// Student/Admin: Get test for taking (no answers)
router.get("/:id", authMiddleware, getMockTestById);

// Admin: Create test
router.post("/", authMiddleware, authorizeRoles("admin"), createMockTest);

// Admin: Update test
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateMockTest);

// Admin: Delete test
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteMockTest);

// Student: Submit test
router.post("/:id/submit", authMiddleware, submitMockTest);

module.exports = router;
