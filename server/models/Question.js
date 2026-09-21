const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
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
            enum: ["DSA", "Aptitude", "Verbal", "CS Fundamentals"],
            required: true,
        },

        topic: {
            type: String,
            required: true,
            trim: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },

        options: [
            {
                type: String,
                trim: true,
            },
        ],

        correctAnswer: {
            type: String,
            required: true,
            trim: true,
        },

        explanation: {
            type: String,
            trim: true,
        },

        tags: [
            {
                type: String,
                trim: true,
            },
        ],

        companyTags: [
            {
                type: String,
                trim: true,
            },
        ],

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

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;