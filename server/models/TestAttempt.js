const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        mockTest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MockTest",
            required: true,
        },
        answers: [
            {
                question: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question",
                    required: true,
                },
                selectedAnswer: {
                    type: String,
                    trim: true,
                    default: "",
                },
                correctAnswer: {
                    type: String,
                    trim: true,
                },
                isCorrect: {
                    type: Boolean,
                    default: false,
                },
                marksObtained: {
                    type: Number,
                    default: 0,
                },
                timeSpentSeconds: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        totalScore: {
            type: Number,
            required: true,
            default: 0,
        },
        totalMarks: {
            type: Number,
            required: true,
            default: 0,
        },
        accuracy: {
            type: Number,
            default: 0,
        },
        correctCount: {
            type: Number,
            default: 0,
        },
        wrongCount: {
            type: Number,
            default: 0,
        },
        unattemptedCount: {
            type: Number,
            default: 0,
        },
        timeTakenSeconds: {
            type: Number,
            default: 0,
        },
        passed: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["completed", "in-progress"],
            default: "completed",
        },
    },
    {
        timestamps: true,
    }
);

const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);

module.exports = TestAttempt;
