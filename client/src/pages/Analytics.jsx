import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProgress } from "../api/api";
import {
    BarChart3,
    Target,
    Clock,
    Award,
    CheckCircle2,
    XCircle,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    BookOpen,
} from "lucide-react";

export default function Analytics() {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getProgress();
                setProgress(data);
            } catch (err) {
                setError(err.message || "Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-sm text-slate-500">Compiling performance analytics...</p>
            </div>
        );
    }

    if (error || !progress) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error || "Unable to load analytics data"}
                </div>
            </div>
        );
    }

    const { summary, categoryStats, topicStats, weakTopics = [], strongTopics = [] } = progress;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                    Performance Analytics
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Track question accuracy, topic-wise mastery, test scores, and targeted improvement areas.
                </p>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Total Solved
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                        {summary.totalAttempts}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        {summary.correctAnswers} correct • {summary.wrongAnswers} incorrect
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Overall Accuracy
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
                        {summary.accuracy}%
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Across all categories</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Mock Tests Completed
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-1">
                        {summary.totalTestsAttempted || 0}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Avg accuracy: {summary.averageTestScore || 0}%
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Total Practice Time
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">
                        {Math.floor((summary.totalTime || 0) / 60)}m {(summary.totalTime || 0) % 60}s
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Active time spent solving</p>
                </div>
            </div>

            {/* Category Accuracy Bars */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Category Accuracy Comparison</h2>
                <p className="text-xs text-slate-500 mb-6">
                    Benchmarks across the 4 foundational placement sections.
                </p>

                <div className="space-y-4">
                    {Object.entries(categoryStats).map(([cat, stats]) => {
                        const acc = stats.accuracy || 0;
                        let barColor = "bg-red-500";
                        if (acc >= 75) barColor = "bg-emerald-500";
                        else if (acc >= 60) barColor = "bg-blue-500";
                        else if (acc >= 40) barColor = "bg-amber-500";

                        return (
                            <div key={cat} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-800">{cat}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-500 font-medium">
                                            {stats.correct} of {stats.attempted} correct
                                        </span>
                                        <span className="font-extrabold text-slate-900 text-sm">
                                            {acc}%
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-700 ${barColor}`}
                                        style={{ width: `${acc}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Weak vs Strong Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weak Areas */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-red-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Weak Areas (&lt; 65% Accuracy)</h3>
                            <p className="text-xs text-slate-500">Requires targeted practice drills</p>
                        </div>
                    </div>

                    {weakTopics.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-xs">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                            No weak topics detected! Keep practicing to maintain your streak.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {weakTopics.map((wt) => (
                                <div
                                    key={wt.topic}
                                    className="flex items-center justify-between p-3.5 rounded-2xl bg-red-50/60 border border-red-200"
                                >
                                    <div>
                                        <span className="text-[10px] font-bold text-red-700 uppercase">
                                            {wt.category}
                                        </span>
                                        <h4 className="text-xs font-bold text-slate-900">{wt.topic}</h4>
                                        <span className="text-[11px] text-slate-500">
                                            {wt.correct}/{wt.attempted} correct ({wt.accuracy}%)
                                        </span>
                                    </div>
                                    <Link
                                        to={`/practice?topic=${encodeURIComponent(wt.topic)}`}
                                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                                    >
                                        Drill Topic
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Strong Areas */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Strong Areas (&ge; 75% Accuracy)</h3>
                            <p className="text-xs text-slate-500">High mastery topics</p>
                        </div>
                    </div>

                    {strongTopics.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-xs">
                            Complete more questions with &gt; 75% accuracy to unlock strong topic badges.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {strongTopics.map((st) => (
                                <div
                                    key={st.topic}
                                    className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200"
                                >
                                    <div>
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase">
                                            {st.category}
                                        </span>
                                        <h4 className="text-xs font-bold text-slate-900">{st.topic}</h4>
                                        <span className="text-[11px] text-slate-500">
                                            {st.correct}/{st.attempted} correct ({st.accuracy}%)
                                        </span>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold">
                                        Mastered
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Topic-Wise Detailed Breakdown Table */}
            {topicStats && Object.keys(topicStats).length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Topic-by-Topic Breakdown</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Topic</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Attempted</th>
                                    <th className="px-4 py-3">Correct</th>
                                    <th className="px-4 py-3">Accuracy</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {Object.entries(topicStats).map(([topic, stats]) => (
                                    <tr key={topic} className="hover:bg-slate-50">
                                        <td className="px-4 py-3.5 font-semibold text-slate-900">
                                            {topic}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-slate-500">
                                            {stats.category}
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-700">
                                            {stats.attempted}
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-700">
                                            {stats.correct}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`text-xs font-bold px-2 py-0.5 rounded ${
                                                    stats.accuracy >= 75
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : stats.accuracy >= 60
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {stats.accuracy}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <Link
                                                to={`/practice?topic=${encodeURIComponent(topic)}`}
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                                            >
                                                Practice →
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
