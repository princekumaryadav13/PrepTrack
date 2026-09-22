import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMockTests, getMyTestAttempts } from "../api/api";
import {
    Clock,
    Award,
    Play,
    CheckCircle2,
    XCircle,
    Calendar,
    ArrowRight,
    Sparkles,
    AlertCircle,
    History,
    Shield,
} from "lucide-react";

export default function MockTests() {
    const [activeTab, setActiveTab] = useState("tests"); // "tests" | "history"
    const [tests, setTests] = useState([]);
    const [myAttempts, setMyAttempts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const categories = [
        "All",
        "Full-Length Placement Mock",
        "Company Specific",
        "Aptitude Special",
        "CS Core Fundamentals",
    ];

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const [testsData, attemptsData] = await Promise.all([
                getMockTests(selectedCategory !== "All" ? { category: selectedCategory } : {}),
                getMyTestAttempts().catch(() => ({ attempts: [] })),
            ]);

            setTests(testsData.mockTests || []);
            setMyAttempts(attemptsData.attempts || []);
        } catch (err) {
            setError(err.message || "Failed to load mock tests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedCategory]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Clock className="w-8 h-8 text-indigo-600" />
                        Timed Mock Tests
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Simulate real placement assessment rounds with countdown timers and instant scorecards.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                    <button
                        onClick={() => setActiveTab("tests")}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === "tests"
                                ? "bg-white text-slate-900 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Available Tests ({tests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === "history"
                                ? "bg-white text-slate-900 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Past Attempts ({myAttempts.length})
                    </button>
                </div>
            </div>

            {/* If Tests Tab */}
            {activeTab === "tests" && (
                <div className="space-y-6">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                                    selectedCategory === cat
                                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="py-16 text-center">
                            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="mt-3 text-sm text-slate-500">Loading mock tests...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
                            {error}
                        </div>
                    ) : tests.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-slate-800">No mock tests available</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Check back soon or select another category.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tests.map((test) => (
                                <div
                                    key={test._id}
                                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-2.5">
                                            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                                                {test.category}
                                            </span>
                                            {test.companyTag && test.companyTag !== "All Companies" && (
                                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700">
                                                    {test.companyTag}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-base font-bold text-slate-900 leading-snug">
                                            {test.title}
                                        </h2>
                                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                                            {test.description}
                                        </p>

                                        {/* Test details chips */}
                                        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                                            <div className="p-2 rounded-xl bg-slate-50">
                                                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                                                    Duration
                                                </span>
                                                <strong className="text-xs text-slate-800">
                                                    {test.durationMinutes}m
                                                </strong>
                                            </div>
                                            <div className="p-2 rounded-xl bg-slate-50">
                                                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                                                    Questions
                                                </span>
                                                <strong className="text-xs text-slate-800">
                                                    {test.questionCount}
                                                </strong>
                                            </div>
                                            <div className="p-2 rounded-xl bg-slate-50">
                                                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                                                    Pass Mark
                                                </span>
                                                <strong className="text-xs text-slate-800">
                                                    {test.passingMarks}/{test.totalMarks}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/mock-tests/${test._id}/take`}
                                        className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-white" />
                                        Start Timed Test
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* If History Tab */}
            {activeTab === "history" && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Your Test Attempts & Scorecards</h2>
                    {myAttempts.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 text-sm">
                            <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p>You haven't completed any mock tests yet.</p>
                            <button
                                onClick={() => setActiveTab("tests")}
                                className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                Browse available tests →
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3">Mock Test</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Score</th>
                                        <th className="px-4 py-3">Accuracy</th>
                                        <th className="px-4 py-3">Time Spent</th>
                                        <th className="px-4 py-3">Result</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {myAttempts.map((att) => (
                                        <tr key={att._id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3.5 font-semibold text-slate-900">
                                                {att.mockTest?.title || "Mock Test"}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-slate-500">
                                                {new Date(att.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3.5 font-bold text-slate-800">
                                                {att.totalScore} / {att.totalMarks}
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-600">
                                                {att.accuracy}%
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-slate-500">
                                                {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                                                        att.passed
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {att.passed ? "Passed" : "Needs Review"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <Link
                                                    to={`/mock-tests/result/${att._id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                                >
                                                    View Solutions <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
