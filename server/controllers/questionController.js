const mongoose = require("mongoose");
const Question = require("../models/Question");

const createQuestion = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            topic,
            difficulty,
            options,
            correctAnswer,
            explanation,
            tags,
            companyTags,
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !topic ||
            !difficulty ||
            !correctAnswer
        ) {
            return res.status(400).json({
                success: false,
                message: "Required question fields are missing",
            });
        }

        const question = await Question.create({
            title: title.trim(),
            description: description.trim(),
            category,
            topic: topic.trim(),
            difficulty,
            options: Array.isArray(options) ? options : [],
            correctAnswer: correctAnswer.trim(),
            explanation: explanation?.trim(),
            tags: Array.isArray(tags) ? tags : [],
            companyTags: Array.isArray(companyTags) ? companyTags : [],
            createdBy: req.user.userId,
        });

        res.status(201).json({
            success: true,
            message: "Question created successfully",
            question,
        });
    } catch (error) {
        console.error("CREATE QUESTION ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getQuestions = async (req, res) => {
    try {
        const {
            category,
            topic,
            difficulty,
            company,
            search,
        } = req.query;

        // Pagination
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 10, 1),
            100
        );

        const skip = (page - 1) * limit;

        const filter = {};

        // Category
        if (category && category !== "All") {
            filter.category = category;
        }

        // Topic
        if (topic) {
            filter.topic = {
                $regex: topic,
                $options: "i",
            };
        }

        // Difficulty
        if (difficulty && difficulty !== "All") {
            filter.difficulty = difficulty;
        }

        // Company
        if (company && company !== "All") {
            filter.$or = [
                { companyTags: { $regex: company, $options: "i" } },
                { tags: { $regex: company, $options: "i" } },
            ];
        }

        // Search
        if (search) {
            const searchRegex = { $regex: search, $options: "i" };
            const searchFilter = [
                { title: searchRegex },
                { description: searchRegex },
                { topic: searchRegex },
                { tags: searchRegex },
                { companyTags: searchRegex },
            ];

            if (filter.$or) {
                filter.$and = [{ $or: filter.$or }, { $or: searchFilter }];
                delete filter.$or;
            } else {
                filter.$or = searchFilter;
            }
        }

        // Get total matching questions
        const totalQuestions = await Question.countDocuments(filter);

        // Get paginated questions
        const questions = await Question.find(filter)
            .select("-correctAnswer")
            .select("-createdBy")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalQuestions / limit) || 1;

        res.status(200).json({
            success: true,
            pagination: {
                currentPage: page,
                limit,
                totalQuestions,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
            questions,
        });
    } catch (error) {
        console.error("GET QUESTIONS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid question ID",
            });
        }

        const question = await Question.findById(id)
            .select("-correctAnswer")
            .select("-createdBy");

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        res.status(200).json({
            success: true,
            question,
        });
    } catch (error) {
        console.error("GET QUESTION ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Admin: Get all questions with correct answers & details
const getAdminQuestions = async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};

        if (category && category !== "All") {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { topic: { $regex: search, $options: "i" } },
            ];
        }

        const questions = await Question.find(filter)
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: questions.length,
            questions,
        });
    } catch (error) {
        console.error("GET ADMIN QUESTIONS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Admin: Update a question
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid question ID",
            });
        }

        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Question updated successfully",
            question: updatedQuestion,
        });
    } catch (error) {
        console.error("UPDATE QUESTION ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Admin: Delete a question
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid question ID",
            });
        }

        const question = await Question.findByIdAndDelete(id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Question deleted successfully",
        });
    } catch (error) {
        console.error("DELETE QUESTION ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    createQuestion,
    getQuestions,
    getQuestionById,
    getAdminQuestions,
    updateQuestion,
    deleteQuestion,
};