const mongoose = require("mongoose");
const MockTest = require("../models/MockTest");
const Question = require("../models/Question");
const TestAttempt = require("../models/TestAttempt");
const Attempt = require("../models/Attempt");

// Admin: Create Mock Test
const createMockTest = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            companyTag,
            durationMinutes,
            totalMarks,
            passingMarks,
            difficulty,
            questions, // [{ question: id, marks: 5 }]
        } = req.body;

        if (!title || !description || !questions || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Title, description, and at least one question are required",
            });
        }

        const formattedQuestions = questions.map((item) => {
            const qId = typeof item === "string" ? item : item.question || item.questionId;
            const marks = typeof item === "object" && item.marks ? item.marks : 5;
            return {
                question: qId,
                marks,
            };
        });

        const calculatedTotalMarks =
            totalMarks ||
            formattedQuestions.reduce((acc, q) => acc + (q.marks || 5), 0);

        const mockTest = await MockTest.create({
            title: title.trim(),
            description: description.trim(),
            category: category || "Full-Length Placement Mock",
            companyTag: companyTag ? companyTag.trim() : "All Companies",
            durationMinutes: parseInt(durationMinutes) || 30,
            totalMarks: calculatedTotalMarks,
            passingMarks: passingMarks || Math.round(calculatedTotalMarks * 0.4),
            difficulty: difficulty || "Medium",
            questions: formattedQuestions,
            createdBy: req.user.userId,
            isPublished: true,
        });

        res.status(201).json({
            success: true,
            message: "Mock test created successfully",
            mockTest,
        });
    } catch (error) {
        console.error("CREATE MOCK TEST ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Student/Admin: Get all published mock tests
const getAllMockTests = async (req, res) => {
    try {
        const { category, companyTag, difficulty } = req.query;
        const filter = { isPublished: true };

        if (category && category !== "All") {
            filter.category = category;
        }

        if (companyTag && companyTag !== "All") {
            filter.companyTag = { $regex: companyTag, $options: "i" };
        }

        if (difficulty && difficulty !== "All") {
            filter.difficulty = difficulty;
        }

        const tests = await MockTest.find(filter)
            .populate({
                path: "questions.question",
                select: "title category topic difficulty",
            })
            .sort({ createdAt: -1 });

        const formattedTests = tests.map((test) => ({
            _id: test._id,
            title: test.title,
            description: test.description,
            category: test.category,
            companyTag: test.companyTag,
            durationMinutes: test.durationMinutes,
            totalMarks: test.totalMarks,
            passingMarks: test.passingMarks,
            difficulty: test.difficulty,
            questionCount: test.questions.length,
            createdAt: test.createdAt,
        }));

        res.status(200).json({
            success: true,
            count: formattedTests.length,
            mockTests: formattedTests,
        });
    } catch (error) {
        console.error("GET ALL MOCK TESTS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Student: Get test for taking (omitting correct answers)
const getMockTestById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mock test ID",
            });
        }

        const test = await MockTest.findById(id).populate({
            path: "questions.question",
            select: "title description category topic difficulty options tags companyTags",
        });

        if (!test || !test.isPublished) {
            return res.status(404).json({
                success: false,
                message: "Mock test not found or not published",
            });
        }

        res.status(200).json({
            success: true,
            mockTest: {
                _id: test._id,
                title: test.title,
                description: test.description,
                category: test.category,
                companyTag: test.companyTag,
                durationMinutes: test.durationMinutes,
                totalMarks: test.totalMarks,
                passingMarks: test.passingMarks,
                difficulty: test.difficulty,
                questions: test.questions.map((item) => ({
                    question: item.question,
                    marks: item.marks,
                })),
            },
        });
    } catch (error) {
        console.error("GET MOCK TEST BY ID ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Admin: Get test with correct answers for editing
const getAdminMockTestById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mock test ID",
            });
        }

        const test = await MockTest.findById(id).populate({
            path: "questions.question",
            select: "title description category topic difficulty options correctAnswer explanation tags companyTags",
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Mock test not found",
            });
        }

        res.status(200).json({
            success: true,
            mockTest: test,
        });
    } catch (error) {
        console.error("GET ADMIN MOCK TEST BY ID ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Admin: Update Mock Test
const updateMockTest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mock test ID",
            });
        }

        const updatedTest = await MockTest.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedTest) {
            return res.status(404).json({
                success: false,
                message: "Mock test not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Mock test updated successfully",
            mockTest: updatedTest,
        });
    } catch (error) {
        console.error("UPDATE MOCK TEST ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Admin: Delete Mock Test
const deleteMockTest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mock test ID",
            });
        }

        const deletedTest = await MockTest.findByIdAndDelete(id);

        if (!deletedTest) {
            return res.status(404).json({
                success: false,
                message: "Mock test not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Mock test deleted successfully",
        });
    } catch (error) {
        console.error("DELETE MOCK TEST ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Student: Submit Test Answers
const submitMockTest = async (req, res) => {
    try {
        const { id } = req.params; // MockTest ID
        const { answers = [], timeTakenSeconds = 0 } = req.body;
        // answers: [{ questionId, selectedAnswer, timeSpentSeconds }]

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mock test ID",
            });
        }

        const test = await MockTest.findById(id).populate("questions.question");

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Mock test not found",
            });
        }

        let totalScore = 0;
        let correctCount = 0;
        let wrongCount = 0;
        let unattemptedCount = 0;

        const evaluatedAnswers = [];
        const individualAttempts = [];

        for (const item of test.questions) {
            const questionDoc = item.question;
            if (!questionDoc) continue;

            const qIdStr = questionDoc._id.toString();
            const submitted = answers.find(
                (a) => (a.questionId || a.question) === qIdStr
            );

            const selected = submitted?.selectedAnswer?.trim() || "";
            const timeSpent = submitted?.timeSpentSeconds || 0;
            const marks = item.marks || 5;

            if (!selected) {
                unattemptedCount++;
                evaluatedAnswers.push({
                    question: questionDoc._id,
                    selectedAnswer: "",
                    correctAnswer: questionDoc.correctAnswer,
                    isCorrect: false,
                    marksObtained: 0,
                    timeSpentSeconds: timeSpent,
                });
            } else {
                const isCorrect = selected === questionDoc.correctAnswer.trim();
                if (isCorrect) {
                    correctCount++;
                    totalScore += marks;
                } else {
                    wrongCount++;
                }

                evaluatedAnswers.push({
                    question: questionDoc._id,
                    selectedAnswer: selected,
                    correctAnswer: questionDoc.correctAnswer,
                    isCorrect,
                    marksObtained: isCorrect ? marks : 0,
                    timeSpentSeconds: timeSpent,
                });

                // Also record into Attempt for global topic/accuracy tracking
                individualAttempts.push({
                    user: req.user.userId,
                    question: questionDoc._id,
                    selectedAnswer: selected,
                    isCorrect,
                    timeTaken: timeSpent,
                });
            }
        }

        if (individualAttempts.length > 0) {
            await Attempt.insertMany(individualAttempts);
        }

        const totalAnswered = correctCount + wrongCount;
        const accuracy =
            totalAnswered > 0
                ? Math.round((correctCount / totalAnswered) * 100)
                : 0;
        const passed = totalScore >= test.passingMarks;

        const testAttempt = await TestAttempt.create({
            user: req.user.userId,
            mockTest: test._id,
            answers: evaluatedAnswers,
            totalScore,
            totalMarks: test.totalMarks,
            accuracy,
            correctCount,
            wrongCount,
            unattemptedCount,
            timeTakenSeconds: timeTakenSeconds || 0,
            passed,
            status: "completed",
        });

        res.status(201).json({
            success: true,
            message: "Test submitted successfully",
            result: {
                attemptId: testAttempt._id,
                testTitle: test.title,
                category: test.category,
                totalScore,
                totalMarks: test.totalMarks,
                passingMarks: test.passingMarks,
                passed,
                accuracy,
                correctCount,
                wrongCount,
                unattemptedCount,
                timeTakenSeconds,
            },
        });
    } catch (error) {
        console.error("SUBMIT MOCK TEST ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Student: Get my mock test history
const getMyTestAttempts = async (req, res) => {
    try {
        const attempts = await TestAttempt.find({ user: req.user.userId })
            .populate({
                path: "mockTest",
                select: "title category companyTag durationMinutes totalMarks passingMarks",
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: attempts.length,
            attempts,
        });
    } catch (error) {
        console.error("GET MY TEST ATTEMPTS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Student/Admin: Get detailed scorecard of a past attempt
const getTestAttemptDetails = async (req, res) => {
    try {
        const { attemptId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(attemptId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid attempt ID",
            });
        }

        const attempt = await TestAttempt.findById(attemptId)
            .populate({
                path: "mockTest",
                select: "title description category companyTag durationMinutes totalMarks passingMarks",
            })
            .populate({
                path: "answers.question",
                select: "title description category topic difficulty options correctAnswer explanation",
            });

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Test attempt not found",
            });
        }

        // Security check: ensure student can only view their own attempt unless admin
        if (
            req.user.role !== "admin" &&
            attempt.user.toString() !== req.user.userId
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to this test attempt",
            });
        }

        res.status(200).json({
            success: true,
            attempt,
        });
    } catch (error) {
        console.error("GET TEST ATTEMPT DETAILS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    createMockTest,
    getAllMockTests,
    getMockTestById,
    getAdminMockTestById,
    updateMockTest,
    deleteMockTest,
    submitMockTest,
    getMyTestAttempts,
    getTestAttemptDetails,
};
