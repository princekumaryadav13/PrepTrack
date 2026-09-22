import { useEffect, useState } from "react";
import { getQuestionById, submitAnswer } from "../api/api";
import {
    Clock,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Tag,
} from "lucide-react";

export default function QuestionPractice({ questionId, onBack, onNext }) {
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [timeTaken, setTimeTaken] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                setResult(null);
                setSelectedAnswer("");
                setTimeTaken(0);

                const data = await getQuestionById(questionId);
                setQuestion(data.question);
            } catch (err) {
                setError(err.message || "Failed to load question");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [questionId]);

    // Active Stopwatch
    useEffect(() => {
        if (!question || result) return;

        const interval = setInterval(() => {
            setTimeTaken((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [question, result]);

    const handleSubmit = async () => {
        if (!selectedAnswer) {
            setError("Please select an answer before submitting.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const data = await submitAnswer(questionId, selectedAnswer, timeTaken);
            setResult(data.result);
        } catch (err) {
            setError(err.message || "Failed to submit answer");
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-sm text-slate-500">Loading question...</p>
            </div>
        );
    }

    if (error && !question) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700">
                    <p className="text-sm font-semibold mb-3">Error: {error}</p>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold"
                    >
                        Back to Questions
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Top Navigation & Stopwatch */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Question Bank
                </button>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Time: {formatTime(timeTaken)}</span>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
                {/* Meta pills */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                        {question.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                        {question.topic}
                    </span>
                    <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            question.difficulty === "Easy"
                                ? "bg-emerald-50 text-emerald-700"
                                : question.difficulty === "Medium"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                        }`}
                    >
                        {question.difficulty}
                    </span>
                </div>

                {/* Question Title & Description */}
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {question.title}
                </h1>
                <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {question.description}
                </p>

                {/* Option Choices */}
                <div className="mt-6 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Select an option:
                    </p>
                    {question.options.map((opt, idx) => {
                        const isSelected = selectedAnswer === opt;
                        return (
                            <label
                                key={idx}
                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                                    isSelected
                                        ? "border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500"
                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                } ${result ? "cursor-default" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="practice-answer"
                                    value={opt}
                                    checked={isSelected}
                                    disabled={Boolean(result)}
                                    onChange={() => setSelectedAnswer(opt)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                                />
                                <span className="text-sm font-medium text-slate-800 leading-relaxed">
                                    {opt}
                                </span>
                            </label>
                        );
                    })}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                        {error}
                    </div>
                )}

                {/* Submit Action */}
                {!result && (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !selectedAnswer}
                        className="mt-6 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 disabled:opacity-50 transition-all cursor-pointer"
                    >
                        {submitting ? "Evaluating response..." : "Submit Answer"}
                    </button>
                )}

                {/* Instant Evaluation Feedback Result */}
                {result && (
                    <div
                        className={`mt-6 p-6 rounded-2xl border transition-all ${
                            result.isCorrect
                                ? "bg-emerald-50/70 border-emerald-200"
                                : "bg-red-50/70 border-red-200"
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            {result.isCorrect ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                    <h3 className="text-base font-bold text-emerald-900">
                                        Correct Answer! 🎉
                                    </h3>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-6 h-6 text-red-600" />
                                    <h3 className="text-base font-bold text-red-900">
                                        Incorrect Response
                                    </h3>
                                </>
                            )}
                        </div>

                        {!result.isCorrect && (
                            <p className="text-sm font-semibold text-slate-800 mt-2">
                                Correct Answer:{" "}
                                <span className="text-emerald-700 font-bold">
                                    {result.correctAnswer}
                                </span>
                            </p>
                        )}

                        {result.explanation && (
                            <div className="mt-3 p-3.5 bg-white/80 rounded-xl border border-slate-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed">
                                <strong className="text-slate-900 block mb-1">
                                    Explanation:
                                </strong>
                                {result.explanation}
                            </div>
                        )}

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                            <span className="text-xs text-slate-500">
                                Time taken: <strong>{formatTime(timeTaken)}</strong>
                            </span>
                            <button
                                onClick={onNext}
                                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
                            >
                                Next Question
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
