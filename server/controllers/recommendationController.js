const User = require("../models/User");
const Attempt = require("../models/Attempt");
const MockTest = require("../models/MockTest");
const Question = require("../models/Question");

// Company Profiles and their syllabus weights
const COMPANY_PROFILES = [
    {
        name: "TCS",
        badge: "Tata Consultancy Services",
        logo: "TCS",
        examPattern: "TCS NQT: Numerical Ability, Verbal Ability, Reasoning Ability, and Advanced Coding.",
        rounds: ["National Qualifier Test (NQT)", "Technical Interview", "HR Interview"],
        categoryWeights: {
            Aptitude: 0.40,
            Verbal: 0.35,
            DSA: 0.25,
            "CS Fundamentals": 0.00,
        },
        keyTopics: ["Time & Work", "Percentages", "Reading Comprehension", "Basic Arrays", "Strings"],
    },
    {
        name: "Amazon",
        badge: "Amazon SDE",
        logo: "AMZN",
        examPattern: "Amazon Online Assessment: 2 DSA Coding Questions + Work Style Simulation / LP.",
        rounds: ["Online Assessment (OA)", "Technical Rounds (DSA & System Design)", "Bar Raiser Interview"],
        categoryWeights: {
            DSA: 0.60,
            "CS Fundamentals": 0.25,
            Aptitude: 0.15,
            Verbal: 0.00,
        },
        keyTopics: ["Binary Trees", "Dynamic Programming", "Graphs", "Operating Systems", "DBMS"],
    },
    {
        name: "Infosys",
        badge: "Infosys InfyTQ / DSE",
        logo: "INFY",
        examPattern: "Online Test: Quantitative Aptitude, Logical Reasoning, Verbal, and Hands-on Coding.",
        rounds: ["Online Assessment", "Technical & Behavioral Interview"],
        categoryWeights: {
            Aptitude: 0.35,
            Verbal: 0.35,
            DSA: 0.20,
            "CS Fundamentals": 0.10,
        },
        keyTopics: ["Permutations & Combinations", "Sentence Correction", "Data Structures", "SQL"],
    },
    {
        name: "Google",
        badge: "Google SWE",
        logo: "GOOG",
        examPattern: "Rigorous DSA problem solving, algorithmic efficiency, and low-level computer concepts.",
        rounds: ["Online Coding Challenge", "4-5 Technical Coding & Architecture Rounds", "Googleyness & Leadership"],
        categoryWeights: {
            DSA: 0.70,
            "CS Fundamentals": 0.25,
            Aptitude: 0.05,
            Verbal: 0.00,
        },
        keyTopics: ["Graphs", "Dynamic Programming", "Tries", "Concurrency", "Memory Management"],
    },
    {
        name: "Wipro",
        badge: "Wipro Elite NLTH",
        logo: "WIPRO",
        examPattern: "Aptitude (Quantitative, Logical, Verbal), Essay Writing, and 2 Coding questions.",
        rounds: ["National Talent Hunt Test", "Technical Interview", "HR Interview"],
        categoryWeights: {
            Aptitude: 0.40,
            Verbal: 0.35,
            DSA: 0.25,
            "CS Fundamentals": 0.00,
        },
        keyTopics: ["Speed Distance Time", "Para Jumbles", "Arrays", "Logical Reasoning"],
    },
    {
        name: "Accenture",
        badge: "Accenture ASE / FSE",
        logo: "ACN",
        examPattern: "Cognitive Assessment, Technical Assessment (Pseudocode, Common Application, MS Office), Coding.",
        rounds: ["Cognitive & Technical Assessment", "Coding Round", "Communication Assessment", "Interview"],
        categoryWeights: {
            Aptitude: 0.35,
            Verbal: 0.35,
            "CS Fundamentals": 0.20,
            DSA: 0.10,
        },
        keyTopics: ["Number Series", "English Grammar", "Computer Networks", "Basic Coding"],
    },
    {
        name: "Microsoft",
        badge: "Microsoft SWE",
        logo: "MSFT",
        examPattern: "Online Coding Test followed by technical interviews focusing on DSA, OOPs, and OS.",
        rounds: ["Codility OA", "3-4 Technical Rounds", "AA (As Appropriate) Interview"],
        categoryWeights: {
            DSA: 0.60,
            "CS Fundamentals": 0.30,
            Aptitude: 0.10,
            Verbal: 0.00,
        },
        keyTopics: ["Linked Lists", "Trees & BST", "Dynamic Programming", "OOPs & Design Patterns", "OS Threads"],
    },
    {
        name: "Cognizant",
        badge: "Cognizant GenC / Elevate",
        logo: "CTSH",
        examPattern: "Quantitative Ability, Verbal Ability, Logical Ability, Automata Fix, and Programming.",
        rounds: ["Aptitude Assessment", "Technical Assessment", "Technical & HR Interview"],
        categoryWeights: {
            Aptitude: 0.40,
            Verbal: 0.35,
            "CS Fundamentals": 0.15,
            DSA: 0.10,
        },
        keyTopics: ["Profit & Loss", "Synonyms & Antonyms", "DBMS Normalization", "Searching & Sorting"],
    },
];

// Helper: Calculate user's category accuracies
const getUserCategoryAccuracies = async (userId) => {
    const attempts = await Attempt.find({ user: userId }).populate({
        path: "question",
        select: "category",
    });

    const categoryStats = {
        DSA: { attempted: 0, correct: 0 },
        Aptitude: { attempted: 0, correct: 0 },
        Verbal: { attempted: 0, correct: 0 },
        "CS Fundamentals": { attempted: 0, correct: 0 },
    };

    attempts.forEach((attempt) => {
        const cat = attempt.question?.category;
        if (cat && categoryStats[cat]) {
            categoryStats[cat].attempted++;
            if (attempt.isCorrect) categoryStats[cat].correct++;
        }
    });

    const accuracies = {};
    for (const [cat, stats] of Object.entries(categoryStats)) {
        accuracies[cat] =
            stats.attempted > 0
                ? Math.round((stats.correct / stats.attempted) * 100)
                : 20; // Default baseline if not attempted
    }

    return { accuracies, categoryStats, totalAttempts: attempts.length };
};

// GET: /api/recommendations
const getRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { accuracies, totalAttempts } = await getUserCategoryAccuracies(user._id);

        // Fetch user attempts to find topic weaknesses
        const attempts = await Attempt.find({ user: user._id }).populate({
            path: "question",
            select: "topic category difficulty",
        });

        const topicMap = {};
        attempts.forEach((a) => {
            const topic = a.question?.topic;
            const category = a.question?.category;
            if (!topic) return;
            if (!topicMap[topic]) {
                topicMap[topic] = { topic, category, attempted: 0, correct: 0 };
            }
            topicMap[topic].attempted++;
            if (a.isCorrect) topicMap[topic].correct++;
        });

        const weakTopics = Object.values(topicMap)
            .map((t) => ({
                topic: t.topic,
                category: t.category,
                accuracy: Math.round((t.correct / t.attempted) * 100),
                attempted: t.attempted,
            }))
            .filter((t) => t.accuracy < 65)
            .sort((a, b) => a.accuracy - b.accuracy);

        // Weak area drills
        const weakAreaDrills = weakTopics.slice(0, 3).map((wt) => ({
            topic: wt.topic,
            category: wt.category,
            currentAccuracy: wt.accuracy,
            recommendedAction: `Practice 5 questions in ${wt.topic} to boost accuracy above 70%`,
            link: `/practice?topic=${encodeURIComponent(wt.topic)}`,
        }));

        // Fetch mock tests matching target companies
        const targetCompanies = user.targetCompanies || ["TCS", "Amazon", "Infosys"];
        const recommendedTests = await MockTest.find({
            isPublished: true,
            $or: [
                { companyTag: { $in: targetCompanies } },
                { category: "Full-Length Placement Mock" },
            ],
        })
            .limit(3)
            .select("title category companyTag durationMinutes totalMarks difficulty");

        // Compute overall placement readiness percentage
        const averageAccuracy =
            Object.values(accuracies).reduce((sum, v) => sum + v, 0) / 4;
        const readinessScore = Math.min(100, Math.round(averageAccuracy));

        // Daily action goals
        const dailyGoals = [
            {
                task: "Solve 5 topic-wise questions",
                category: weakTopics.length > 0 ? weakTopics[0].category : "DSA",
                topic: weakTopics.length > 0 ? weakTopics[0].topic : "Arrays",
                done: totalAttempts >= 5,
            },
            {
                task: "Take 1 timed mock test",
                category: "Full-Length",
                done: false,
            },
            {
                task: `Prepare for target company: ${targetCompanies[0] || "TCS"}`,
                category: "Company Prep",
                done: false,
            },
        ];

        res.status(200).json({
            success: true,
            placementGoal: user.placementGoal || "Product-Based Companies",
            targetCompanies,
            readinessScore,
            weakAreaDrills,
            recommendedTests,
            dailyGoals,
        });
    } catch (error) {
        console.error("GET RECOMMENDATIONS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// GET: /api/recommendations/companies
const getCompanyReadiness = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { accuracies } = await getUserCategoryAccuracies(user._id);
        const userTargets = user.targetCompanies || [];

        const companies = COMPANY_PROFILES.map((company) => {
            let score = 0;
            for (const [category, weight] of Object.entries(company.categoryWeights)) {
                const categoryAcc = accuracies[category] || 20;
                score += categoryAcc * weight;
            }

            const readinessPercentage = Math.round(score);

            let status = "Needs Practice";
            if (readinessPercentage >= 75) status = "Ready";
            else if (readinessPercentage >= 50) status = "In Progress";

            return {
                name: company.name,
                badge: company.badge,
                logo: company.logo,
                examPattern: company.examPattern,
                rounds: company.rounds,
                keyTopics: company.keyTopics,
                weights: company.categoryWeights,
                readinessPercentage,
                status,
                isTarget: userTargets.includes(company.name),
            };
        });

        res.status(200).json({
            success: true,
            placementGoal: user.placementGoal || "Product-Based Companies",
            targetCompanies: userTargets,
            companies,
        });
    } catch (error) {
        console.error("GET COMPANY READINESS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    getRecommendations,
    getCompanyReadiness,
};
