import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTestAttemptDetails } from "../api/api";
import {
    Award,
    CheckCircle2,
    XCircle,
    Clock,
    Target,
    HelpCircle,
    ArrowLeft,
    RotateCcw,
    BookOpen,
    Filter,
} from "lucide-react";

export default function MockTestResult() {
    const { attemptId } = useParams();
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterMode, setFilterMode] = useState("all"); // "all" | "correct" | "incorrect" | "unattempted"

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getTestAttemptDetails(attemptId);
                setAttempt(data.attempt);
            } catch (err) {
                setError(err.message || "Failed to load test attempt");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [attemptId]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-sm text-slate-500">Generating your test scorecard & solutions...</p>
            </div>
        );
    }

    if (error || !attempt) {
        return (
            <div className="max-w-xl mx-auto mt-16 p-6 rounded-2xl bg-white border border-slate-200 text-center shadow-lg">
                <XCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                <h2 className="text-lg font-bold text-slate-900">Scorecard Not Found</h2>
                <p className="text-sm text-slate-600 mt-1">{error || "Unable to find attempt details"}</p>
                <Link
                    to="/mock-tests"
                    className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                >
                    Back to Mock Tests
                </Link>
            </div>
        );
    }

    const test = attempt.mockTest;
    const isPassed = attempt.passed;
    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}m ${s}s`;
    };

    const filteredAnswers = attempt.answers.filter((item) => {
        if (filterMode === "correct") return item.isCorrect;
        if (filterMode === "incorrect") return !item.isCorrect && item.selectedAnswer;
        if (filterMode === "unattempted") return !item.selectedAnswer;
        return true;
    });

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Top Back Link */}
            <div className="flex items-center justify-between">
                <Link
                    to="/mock-tests"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Mock Tests
                </Link>
                <span className="text-xs text-slate-400">
                    Attempt ID: {attempt._id}
                </span>
            </div>

            {/* Scorecard Hero Banner */}
            <div
                className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl ${
                    isPassed
                        ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700"
                        : "bg-gradient-to-r from-red-600 via-rose-600 to-slate-800"
                }`}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur mb-3">
                            <Award className="w-3.5 h-3.5" />
                            {isPassed ? "Assessment Passed" : "Needs Further Practice"}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {test?.title || "Mock Test"}
                        </h1>
                        <p className="mt-1 text-white/80 text-sm">
                            Passing score required: {test?.passingMarks} marks • Total available: {attempt.totalMarks} marks
                        </p>
                    </div>

                    {/* Big Score Badge */}
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 self-start md:self-auto">
                        <div className="text-right">
                            <span className="text-xs text-white/70 uppercase font-semibold block">
                                Score Achieved
                            </span>
                            <div className="text-3xl sm:text-4xl font-extrabold text-white">
                                {attempt.totalScore}{" "}
                                <span className="text-lg font-normal text-white/70">
                                    / {attempt.totalMarks}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score breakdown metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs text-center">
                        <span className="text-[11px] text-white/70 uppercase font-semibold block">
                            Accuracy
                        </span>
                        <strong className="text-xl font-bold">{attempt.accuracy}%</strong>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs text-center">
                        <span className="text-[11px] text-white/70 uppercase font-semibold block">
                            Correct
                        </span>
                        <strong className="text-xl font-bold text-emerald-200">
                            {attempt.correctCount}
                        </strong>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs text-center">
                        <span className="text-[11px] text-white/70 uppercase font-semibold block">
                            Incorrect
                        </span>
                        <strong className="text-xl font-bold text-rose-200">
                            {attempt.wrongCount}
                        </strong>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs text-center">
                        <span className="text-[11px] text-white/70 uppercase font-semibold block">
                            Time Taken
                        </span>
                        <strong className="text-xl font-bold">
                            {formatTime(attempt.timeTakenSeconds)}
                        </strong>
                    </div>
                </div>
            </div>

            {/* Solutions & Explanations Review Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Detailed Question Solutions
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Review your selected answers and understand the correct solutions.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setFilterMode("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                filterMode === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                            }`}
                        >
                            All ({attempt.answers.length})
                        </button>
                        <button
                            onClick={() => setFilterMode("correct")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                filterMode === "correct" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600"
                            }`}
                        >
                            Correct ({attempt.correctCount})
                        </button>
                        <button
                            onClick={() => setFilterMode("incorrect")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                filterMode === "incorrect" ? "bg-red-600 text-white shadow-xs" : "text-slate-600"
                            }`}
                        >
                            Incorrect ({attempt.wrongCount})
                        </button>
                        <button
                            onClick={() => setFilterMode("unattempted")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                filterMode === "unattempted" ? "bg-slate-700 text-white shadow-xs" : "text-slate-600"
                            }`}
                        >
                            Skipped ({attempt.unattemptedCount})
                        </button>
                    </div>
                </div>

                {/* Questions Review List */}
                <div className="space-y-6">
                    {filteredAnswers.map((item, idx) => {
                        const q = item.question;
                        if (!q) return null;

                        const isCorrect = item.isCorrect;
                        const isSkipped = !item.selectedAnswer;

                        return (
                            <div
                                key={item._id || idx}
                                className={`rounded-2xl p-6 border transition-all ${
                                    isCorrect
                                        ? "bg-emerald-50/30 border-emerald-200"
                                        : isSkipped
                                        ? "bg-slate-50/70 border-slate-200"
                                        : "bg-red-50/30 border-red-200"
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-500">
                                            Question {idx + 1}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                                            {q.category}
                                        </span>
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                            {q.topic}
                                        </span>
                                    </div>

                                    <div>
                                        {isCorrect ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> +{item.marksObtained} Marks
                                            </span>
                                        ) : isSkipped ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
                                                Unattempted (0 Marks)
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                                                <XCircle className="w-3.5 h-3.5" /> 0 Marks
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-2">
                                    {q.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-700 mt-1 whitespace-pre-line leading-relaxed">
                                    {q.description}
                                </p>

                                {/* Options Review */}
                                <div className="mt-4 space-y-2">
                                    {q.options?.map((opt, optIdx) => {
                                        const isUserChoice = item.selectedAnswer === opt;
                                        const isCorrectChoice = q.correctAnswer === opt;

                                        let style = "border-slate-200 bg-white text-slate-700";
                                        if (isCorrectChoice) {
                                            style = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500";
                                        } else if (isUserChoice && !isCorrect) {
                                            style = "border-red-400 bg-red-50 text-red-900 font-semibold ring-1 ring-red-400";
                                        }

                                        return (
                                            <div
                                                key={optIdx}
                                                className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm ${style}`}
                                            >
                                                <span>{opt}</span>
                                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                                    {isUserChoice && (
                                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-white">
                                                            Your Answer
                                                        </span>
                                                    )}
                                                    {isCorrectChoice && (
                                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                                                            Correct Answer
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                {q.explanation && (
                                    <div className="mt-4 p-3.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                                        <strong className="text-slate-900 block mb-1">
                                            Solution Explanation:
                                        </strong>
                                        {q.explanation}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
