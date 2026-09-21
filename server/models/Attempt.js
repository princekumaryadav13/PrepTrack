const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },

        selectedAnswer: {
            type: String,
            required: true,
            trim: true,
        },

        isCorrect: {
            type: Boolean,
            required: true,
        },

        timeTaken: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Attempt = mongoose.model("Attempt", attemptSchema);

module.exports = Attempt;