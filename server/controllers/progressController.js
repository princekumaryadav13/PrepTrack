const Attempt = require("../models/Attempt");
const TestAttempt = require("../models/TestAttempt");

const getProgress = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch question attempts
        const attempts = await Attempt.find({
            user: userId,
        })
            .populate({
                path: "question",
                select: "title category topic difficulty",
            })
            .sort({ createdAt: -1 });

        // Fetch test attempts
        const testAttempts = await TestAttempt.find({
            user: userId,
        })
            .populate({
                path: "mockTest",
                select: "title category companyTag totalMarks passingMarks durationMinutes",
            })
            .sort({ createdAt: -1 });

        const totalAttempts = attempts.length;

        const correctAnswers = attempts.filter(
            (attempt) => attempt.isCorrect
        ).length;

        const wrongAnswers = totalAttempts - correctAnswers;

        const accuracy =
            totalAttempts === 0
                ? 0
                : Math.round((correctAnswers / totalAttempts) * 100);

        const totalTime = attempts.reduce(
            (sum, attempt) => sum + (attempt.timeTaken || 0),
            0
        );

        // Mock test analytics
        const totalTestsAttempted = testAttempts.length;
        const totalTestsPassed = testAttempts.filter((t) => t.passed).length;
        const averageTestScore =
            totalTestsAttempted === 0
                ? 0
                : Math.round(
                      testAttempts.reduce(
                          (sum, t) => sum + (t.accuracy || 0),
                          0
                      ) / totalTestsAttempted
                  );

        // Category statistics (Aptitude, Verbal, DSA, CS Fundamentals)
        const categoryStats = {
            Aptitude: { attempted: 0, correct: 0, accuracy: 0 },
            Verbal: { attempted: 0, correct: 0, accuracy: 0 },
            DSA: { attempted: 0, correct: 0, accuracy: 0 },
            "CS Fundamentals": { attempted: 0, correct: 0, accuracy: 0 },
        };

        attempts.forEach((attempt) => {
            const category = attempt.question?.category;
            if (!category) return;

            if (!categoryStats[category]) {
                categoryStats[category] = {
                    attempted: 0,
                    correct: 0,
                    accuracy: 0,
                };
            }

            categoryStats[category].attempted++;
            if (attempt.isCorrect) {
                categoryStats[category].correct++;
            }
        });

        Object.keys(categoryStats).forEach((category) => {
            const stats = categoryStats[category];
            stats.accuracy =
                stats.attempted > 0
                    ? Math.round((stats.correct / stats.attempted) * 100)
                    : 0;
        });

        // Topic statistics
        const topicStats = {};

        attempts.forEach((attempt) => {
            const topic = attempt.question?.topic;
            const category = attempt.question?.category;
            if (!topic) return;

            if (!topicStats[topic]) {
                topicStats[topic] = {
                    category: category || "General",
                    attempted: 0,
                    correct: 0,
                    accuracy: 0,
                };
            }

            topicStats[topic].attempted++;
            if (attempt.isCorrect) {
                topicStats[topic].correct++;
            }
        });

        Object.keys(topicStats).forEach((topic) => {
            const stats = topicStats[topic];
            stats.accuracy = Math.round(
                (stats.correct / stats.attempted) * 100
            );
        });

        // Identify Weak Topics (accuracy < 65% with at least 1 attempt)
        const weakTopics = Object.entries(topicStats)
            .filter(([_, stats]) => stats.accuracy < 65 && stats.attempted > 0)
            .map(([topic, stats]) => ({
                topic,
                category: stats.category,
                accuracy: stats.accuracy,
                attempted: stats.attempted,
                correct: stats.correct,
            }))
            .sort((a, b) => a.accuracy - b.accuracy);

        // Identify Strong Topics (accuracy >= 75%)
        const strongTopics = Object.entries(topicStats)
            .filter(([_, stats]) => stats.accuracy >= 75)
            .map(([topic, stats]) => ({
                topic,
                category: stats.category,
                accuracy: stats.accuracy,
                attempted: stats.attempted,
                correct: stats.correct,
            }))
            .sort((a, b) => b.accuracy - a.accuracy);

        // Recent Activity
        const recentAttempts = attempts.slice(0, 6).map((a) => ({
            id: a._id,
            questionTitle: a.question?.title || "Question",
            category: a.question?.category || "Practice",
            topic: a.question?.topic || "",
            isCorrect: a.isCorrect,
            timeTaken: a.timeTaken,
            date: a.createdAt,
        }));

        const recentTests = testAttempts.slice(0, 5).map((t) => ({
            attemptId: t._id,
            testTitle: t.mockTest?.title || "Mock Test",
            category: t.mockTest?.category || "Full-Length",
            score: t.totalScore,
            totalMarks: t.totalMarks,
            accuracy: t.accuracy,
            passed: t.passed,
            date: t.createdAt,
        }));

        res.status(200).json({
            success: true,
            summary: {
                totalAttempts,
                correctAnswers,
                wrongAnswers,
                accuracy,
                totalTime,
                totalTestsAttempted,
                totalTestsPassed,
                averageTestScore,
            },
            categoryStats,
            topicStats,
            weakTopics,
            strongTopics,
            recentAttempts,
            recentTests,
        });
    } catch (error) {
        console.error("GET PROGRESS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    getProgress,
};