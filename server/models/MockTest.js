const mongoose = require("mongoose");

const mockTestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: [
                "Full-Length Placement Mock",
                "Aptitude Special",
                "Verbal & Reasoning",
                "CS Core Fundamentals",
                "Company Specific",
            ],
            default: "Full-Length Placement Mock",
        },
        companyTag: {
            type: String,
            trim: true,
            default: "All Companies",
        },
        durationMinutes: {
            type: Number,
            required: true,
            min: 5,
            max: 180,
            default: 30,
        },
        totalMarks: {
            type: Number,
            required: true,
            default: 100,
        },
        passingMarks: {
            type: Number,
            required: true,
            default: 40,
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium",
        },
        questions: [
            {
                question: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question",
                    required: true,
                },
                marks: {
                    type: Number,
                    default: 5,
                },
            },
        ],
        isPublished: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const MockTest = mongoose.model("MockTest", mockTestSchema);

module.exports = MockTest;
