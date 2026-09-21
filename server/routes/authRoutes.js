const express = require("express");

const {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
 
const router = express.Router();
router.get(
    "/admin-test",
    authMiddleware,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Admin!",
        });
    }
);
router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", authMiddleware, getCurrentUser);

router.put("/profile", authMiddleware, updateProfile);

module.exports = router;