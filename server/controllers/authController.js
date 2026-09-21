const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, targetCompanies, placementGoal } = req.body;

        // 1. Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        // 2. Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        // 3. Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // 4. Check if user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // 5. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: role === "admin" ? "admin" : "student",
            targetCompanies: Array.isArray(targetCompanies) ? targetCompanies : ["TCS", "Amazon", "Infosys"],
            placementGoal: placementGoal || "Product-Based Companies",
        });

        // 7. Return safe response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                targetCompanies: user.targetCompanies,
                placementGoal: user.placementGoal,
            },
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const jwtSecret =
            process.env.JWT_SECRET || "preptrack_secret_jwt_key_2025_prod_ready";

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            jwtSecret,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d",
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                targetCompanies: user.targetCompanies,
                placementGoal: user.placementGoal,
            },
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("GET CURRENT USER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, targetCompanies, placementGoal } = req.body;
        const updateData = {};

        if (name) updateData.name = name.trim();
        if (targetCompanies && Array.isArray(targetCompanies)) {
            updateData.targetCompanies = targetCompanies;
        }
        if (placementGoal) {
            updateData.placementGoal = placementGoal.trim();
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
};