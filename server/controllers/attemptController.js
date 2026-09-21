const mongoose = require("mongoose");
const Attempt = require("../models/Attempt");
const Question = require("../models/Question");

const submitAnswer = async (req, res) => {
    try {
        const { questionId, selectedAnswer, timeTaken } = req.body;

        if (!questionId || !selectedAnswer) {
            return res.status(400).json({
                success: false,
                message: "Question ID and selected answer are required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({
        success: false,
        message: "Invalid question ID",
    });
}

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        const isCorrect =
            selectedAnswer.trim() === question.correctAnswer.trim();

        const attempt = await Attempt.create({
            user: req.user.userId,
            question: questionId,
            selectedAnswer: selectedAnswer.trim(),
            isCorrect,
            timeTaken: timeTaken || 0,
        });

        res.status(201).json({
            success: true,
            message: "Answer submitted successfully",
            result: {
                isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                attemptId: attempt._id,
            },
        });
    } catch (error) {
        console.error("SUBMIT ANSWER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    submitAnswer,
};