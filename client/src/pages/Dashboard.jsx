import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProgress, getRecommendations } from "../api/api";
import {
    Target,
    CheckCircle2,
    Clock,
    Award,
    Flame,
    ArrowRight,
    TrendingUp,
    AlertTriangle,
    BookOpen,
    Play,
    Sparkles,
    Briefcase,
} from "lucide-react";

export default function Dashboard() {
    const { user } = useAuth();
    const [progress, setProgress] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const [progressData, recsData] = await Promise.all([
                getProgress().catch((err) => {
                    console.warn("Could not load progress:", err.message);
                    return null;
                }),
                getRecommendations().catch((err) => {
                    console.warn("Could not load recommendations:", err.message);
                    return null;
                }),
            ]);

            setProgress(progressData);
            setRecommendations(recsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm font-medium text-slate-500">Loading your placement dashboard...</p>
                </div>
            </div>
        );
    }

    const summary = progress?.summary || {
        totalAttempts: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        accuracy: 0,
        totalTime: 0,
        totalTestsAttempted: 0,
        averageTestScore: 0,
    };

    const categoryStats = progress?.categoryStats || {
        DSA: { attempted: 0, correct: 0, accuracy: 0 },
        Aptitude: { attempted: 0, correct: 0, accuracy: 0 },
        Verbal: { attempted: 0, correct: 0, accuracy: 0 },
        "CS Fundamentals": { attempted: 0, correct: 0, accuracy: 0 },
    };

    const weakTopics = progress?.weakTopics || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Greeting Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                            Target Goal: {user?.placementGoal || "Product-Based Companies"}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Welcome back, {user?.name || "Candidate"}!
                        </h1>
                        <p className="mt-1.5 text-blue-100 text-sm max-w-xl">
                            Sharpen aptitude, verbal, DSA, and CS fundamentals with topic drills and timed mock tests.
                        </p>

                        {user?.targetCompanies && user.targetCompanies.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="text-xs text-blue-200 font-medium">Target Recruiters:</span>
                                {user.targetCompanies.map((c) => (
                                    <span
                                        key={c}
                                        className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-white/20 text-white"
                                    >
                                        {c}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/mock-tests"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-900 font-semibold text-sm hover:bg-blue-50 shadow-md transition-colors"
                        >
                            <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                            Start Mock Test
                        </Link>
                        <Link
                            to="/practice"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur border border-white/20 transition-colors"
                        >
                            <BookOpen className="w-4 h-4" />
                            Practice Questions
                        </Link>
                    </div>
                </div>

                {/* Background decorative orb */}
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">Questions Solved</span>
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {summary.totalAttempts}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        {summary.correctAnswers} correct • {summary.wrongAnswers} incorrect
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">Overall Accuracy</span>
                        <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {summary.accuracy}%
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                        <div
                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${summary.accuracy}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">Mock Tests</span>
                        <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {summary.totalTestsAttempted || 0}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        {summary.totalTestsPassed || 0} passed successfully
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">Placement Readiness</span>
                        <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {recommendations?.readinessScore || Math.min(100, Math.round((summary.accuracy + 20) / 1.2))}%
                    </div>
                    <p className="text-xs text-purple-600 font-medium mt-1">
                        Based on target company requirements
                    </p>
                </div>
            </div>

            {/* Personalized Recommendations & Daily Goals */}
            {recommendations && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-500" />
                                <h2 className="text-lg font-bold text-slate-900">
                                    Personalized Recommendations
                                </h2>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Tailored to your performance and target placement goals.
                            </p>
                        </div>
                        <Link
                            to="/companies"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                            View Company Readiness <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Weak Drill Recommendation */}
                        {recommendations.weakAreaDrills && recommendations.weakAreaDrills.length > 0 ? (
                            <div className="p-4 rounded-xl bg-red-50/70 border border-red-200/80 flex flex-col justify-between">
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                                        Weak Topic Drill
                                    </span>
                                    <h3 className="font-bold text-slate-900 text-sm">
                                        {recommendations.weakAreaDrills[0].topic}
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Current accuracy:{" "}
                                        <strong className="text-red-600">
                                            {recommendations.weakAreaDrills[0].currentAccuracy}%
                                        </strong>
                                        . Practice recommended questions to raise it above 70%.
                                    </p>
                                </div>
                                <Link
                                    to={recommendations.weakAreaDrills[0].link}
                                    className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                                >
                                    Practice {recommendations.weakAreaDrills[0].topic} →
                                </Link>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex flex-col justify-between">
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                                        Strong Foundation
                                    </span>
                                    <h3 className="font-bold text-slate-900 text-sm">
                                        No Critical Weaknesses!
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1">
                                        You have maintained strong accuracy across practiced topics.
                                    </p>
                                </div>
                                <Link
                                    to="/practice"
                                    className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                                >
                                    Explore Advanced Questions →
                                </Link>
                            </div>
                        )}

                        {/* Next Mock Test Suggestion */}
                        {recommendations.recommendedTests && recommendations.recommendedTests.length > 0 ? (
                            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col justify-between">
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                                        Target Mock Test
                                    </span>
                                    <h3 className="font-bold text-slate-900 text-sm">
                                        {recommendations.recommendedTests[0].title}
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1">
                                        {recommendations.recommendedTests[0].durationMinutes} mins •{" "}
                                        {recommendations.recommendedTests[0].difficulty} difficulty
                                    </p>
                                </div>
                                <Link
                                    to={`/mock-tests`}
                                    className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                                >
                                    Take Timed Mock Test →
                                </Link>
                            </div>
                        ) : null}

                        {/* Daily Placement Target */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                            <div>
                                <span className="inline-block px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                                    Daily Target
                                </span>
                                <h3 className="font-bold text-slate-900 text-sm">
                                    Placement Sprint Checklist
                                </h3>
                                <div className="space-y-1.5 mt-2">
                                    {recommendations.dailyGoals?.map((g, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                                            <div
                                                className={`w-4 h-4 rounded flex items-center justify-center border ${
                                                    g.done
                                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                                        : "border-slate-300 bg-white"
                                                }`}
                                            >
                                                {g.done && <CheckCircle2 className="w-3 h-3" />}
                                            </div>
                                            <span className={g.done ? "line-through text-slate-400" : ""}>
                                                {g.task}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Link
                                to="/practice"
                                className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-colors"
                            >
                                Continue Daily Practice →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Performance Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Category Mastery</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Performance across core placement syllabus pillars.
                        </p>
                    </div>
                    <Link
                        to="/analytics"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Detailed Analytics <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(categoryStats).map(([cat, stats]) => (
                        <div
                            key={cat}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    {cat}
                                </span>
                                <span
                                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                                        stats.accuracy >= 70
                                            ? "bg-emerald-100 text-emerald-700"
                                            : stats.accuracy >= 50
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {stats.accuracy}%
                                </span>
                            </div>

                            <p className="text-xs text-slate-500 mb-3">
                                {stats.correct} / {stats.attempted} questions correct
                            </p>

                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                        stats.accuracy >= 70
                                            ? "bg-emerald-500"
                                            : stats.accuracy >= 50
                                            ? "bg-amber-500"
                                            : "bg-red-500"
                                    }`}
                                    style={{ width: `${stats.accuracy}%` }}
                                />
                            </div>

                            <Link
                                to={`/practice?category=${encodeURIComponent(cat)}`}
                                className="mt-4 block text-center text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Practice {cat} →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weak Topics Targeted Drills */}
            {weakTopics.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Target Weak Areas</h2>
                            <p className="text-xs text-slate-500">
                                Topics below 65% accuracy identified for targeted revision.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {weakTopics.map((item) => (
                            <div
                                key={item.topic}
                                className="p-4 rounded-xl border border-red-200 bg-red-50/40 flex items-center justify-between"
                            >
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                                        {item.category}
                                    </span>
                                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                                        {item.topic}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Accuracy: <strong className="text-red-600">{item.accuracy}%</strong> ({item.correct}/{item.attempted})
                                    </p>
                                </div>
                                <Link
                                    to={`/practice?topic=${encodeURIComponent(item.topic)}`}
                                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                                >
                                    Practice
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Activity & Test History */}
            {progress?.recentTests && progress.recentTests.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Mock Test Attempts</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Mock Test</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Score</th>
                                    <th className="px-4 py-3">Accuracy</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Scorecard</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {progress.recentTests.map((t) => (
                                    <tr key={t.attemptId} className="hover:bg-slate-50">
                                        <td className="px-4 py-3.5 font-semibold text-slate-900">
                                            {t.testTitle}
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600 text-xs">
                                            {t.category}
                                        </td>
                                        <td className="px-4 py-3.5 font-bold text-slate-800">
                                            {t.score} / {t.totalMarks}
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600">
                                            {t.accuracy}%
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`text-xs font-bold px-2 py-0.5 rounded ${
                                                    t.passed
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {t.passed ? "Passed" : "Needs Review"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <Link
                                                to={`/mock-tests/result/${t.attemptId}`}
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                                            >
                                                View Solutions →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}