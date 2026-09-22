import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMockTestById, submitMockTest } from "../api/api";
import {
    Clock,
    AlertTriangle,
    CheckCircle2,
    Bookmark,
    ArrowLeft,
    ArrowRight,
    Send,
    Flag,
    HelpCircle,
    X,
} from "lucide-react";

export default function MockTestRunner() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { [qId]: selectedAnswer }
    const [markedForReview, setMarkedForReview] = useState(new Set());
    const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
    const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // Load Test
    useEffect(() => {
        const fetchTest = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getMockTestById(id);
                const loadedTest = data.mockTest;
                setTest(loadedTest);

                const durSeconds = loadedTest.durationMinutes * 60;
                setTimeRemaining(durSeconds);
                setTotalDurationSeconds(durSeconds);
            } catch (err) {
                setError(err.message || "Failed to load test");
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    }, [id]);

    // Countdown Timer & Auto-Submit
    useEffect(() => {
        if (!test || timeRemaining <= 0 || isSubmitting) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [test, timeRemaining, isSubmitting]);

    const handleAutoSubmit = () => {
        alert("⏱ Time has expired! Your test is being automatically submitted.");
        executeSubmission();
    };

    const handleAnswerSelect = (option) => {
        if (!test) return;
        const currentQ = test.questions[currentIndex]?.question;
        if (!currentQ) return;

        setAnswers((prev) => ({
            ...prev,
            [currentQ._id]: option,
        }));
    };

    const handleClearResponse = () => {
        if (!test) return;
        const currentQ = test.questions[currentIndex]?.question;
        if (!currentQ) return;

        setAnswers((prev) => {
            const copy = { ...prev };
            delete copy[currentQ._id];
            return copy;
        });
    };

    const handleToggleReview = () => {
        if (!test) return;
        const currentQ = test.questions[currentIndex]?.question;
        if (!currentQ) return;

        setMarkedForReview((prev) => {
            const next = new Set(prev);
            if (next.has(currentQ._id)) {
                next.delete(currentQ._id);
            } else {
                next.add(currentQ._id);
            }
            return next;
        });
    };

    const executeSubmission = async () => {
        if (isSubmitting || !test) return;

        try {
            setIsSubmitting(true);
            const timeTaken = totalDurationSeconds - timeRemaining;

            const formattedAnswers = test.questions.map((item) => {
                const qId = item.question._id;
                return {
                    questionId: qId,
                    selectedAnswer: answers[qId] || "",
                    timeSpentSeconds: 0,
                };
            });

            const res = await submitMockTest(test._id, formattedAnswers, timeTaken);
            navigate(`/mock-tests/result/${res.result.attemptId}`, { replace: true });
        } catch (err) {
            alert("Error submitting test: " + err.message);
            setIsSubmitting(false);
        }
    };

    const formatTimer = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-slate-400">Preparing examination environment...</p>
            </div>
        );
    }

    if (error || !test) {
        return (
            <div className="max-w-xl mx-auto mt-16 p-6 rounded-2xl bg-white border border-slate-200 text-center shadow-lg">
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                <h2 className="text-lg font-bold text-slate-900">Unable to Start Mock Test</h2>
                <p className="text-sm text-slate-600 mt-1">{error || "Test not found"}</p>
                <button
                    onClick={() => navigate("/mock-tests")}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                >
                    Back to Mock Tests
                </button>
            </div>
        );
    }

    const currentItem = test.questions[currentIndex];
    const currentQ = currentItem?.question;
    const currentMarks = currentItem?.marks || 5;

    const isAnswered = currentQ && Boolean(answers[currentQ._id]);
    const isMarked = currentQ && markedForReview.has(currentQ._id);

    // Summary counts
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = test.questions.length;
    const markedCount = markedForReview.size;
    const unansweredCount = totalQuestions - answeredCount;

    const isNearEnd = timeRemaining <= 120; // less than 2 mins

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            {/* Exam Top Bar */}
            <header className="sticky top-0 z-40 bg-slate-900 text-white px-4 sm:px-8 py-3.5 shadow-md flex items-center justify-between">
                <div>
                    <h1 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                        {test.title}
                    </h1>
                    <span className="text-[11px] text-slate-400">
                        {test.category} • Passing: {test.passingMarks}/{test.totalMarks} marks
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Live Timer */}
                    <div
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold shadow-xs transition-colors ${
                            isNearEnd
                                ? "bg-red-600 text-white animate-pulse"
                                : "bg-slate-800 text-emerald-400 border border-slate-700"
                        }`}
                    >
                        <Clock className="w-4 h-4" />
                        <span>{formatTimer(timeRemaining)}</span>
                    </div>

                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                        Submit Test
                    </button>
                </div>
            </header>

            {/* Main Exam Runner Body */}
            <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Question Viewer (8 cols) */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px]">
                    <div>
                        {/* Question Meta Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Question {currentIndex + 1} of {totalQuestions}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                                    +{currentMarks} Marks
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                    {currentQ?.category}
                                </span>
                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                                    {currentQ?.topic}
                                </span>
                            </div>
                        </div>

                        {/* Title & Description */}
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {currentQ?.title}
                        </h2>
                        <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line">
                            {currentQ?.description}
                        </div>

                        {/* Options */}
                        <div className="mt-6 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Choose one answer:
                            </p>
                            {currentQ?.options?.map((opt, i) => {
                                const selected = answers[currentQ._id] === opt;
                                return (
                                    <label
                                        key={i}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                                            selected
                                                ? "border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500"
                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`q-${currentQ._id}`}
                                            value={opt}
                                            checked={selected}
                                            onChange={() => handleAnswerSelect(opt)}
                                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                        />
                                        <span className="text-sm font-medium text-slate-800">
                                            {opt}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Question Actions footer */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleClearResponse}
                                disabled={!isAnswered}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                            >
                                Clear Response
                            </button>
                            <button
                                type="button"
                                onClick={handleToggleReview}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                                    isMarked
                                        ? "bg-purple-600 text-white"
                                        : "border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                                }`}
                            >
                                <Bookmark className="w-3.5 h-3.5" />
                                {isMarked ? "Marked for Review" : "Mark for Review"}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                                disabled={currentIndex === 0}
                                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Previous
                            </button>

                            {currentIndex < totalQuestions - 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                                    className="flex items-center gap-1 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitModal(true)}
                                    className="flex items-center gap-1 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                                >
                                    Review & Submit
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Question Navigation Palette (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                            Question Palette
                        </h3>

                        {/* Status Legend */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                                    ✓
                                </div>
                                <span>Answered ({answeredCount})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                                    ★
                                </div>
                                <span>Review ({markedCount})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-slate-100 border border-slate-300 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                                    •
                                </div>
                                <span>Unanswered ({unansweredCount})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md ring-2 ring-indigo-600 flex items-center justify-center text-[10px]">
                                    📍
                                </div>
                                <span>Current</span>
                            </div>
                        </div>

                        {/* Number Buttons Grid */}
                        <div className="grid grid-cols-5 gap-2.5 max-h-72 overflow-y-auto pr-1">
                            {test.questions.map((item, idx) => {
                                const qId = item.question._id;
                                const isAns = Boolean(answers[qId]);
                                const isRev = markedForReview.has(qId);
                                const isCurrent = currentIndex === idx;

                                let bgClass = "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200";
                                if (isRev) {
                                    bgClass = "bg-purple-600 text-white hover:bg-purple-700 shadow-xs";
                                } else if (isAns) {
                                    bgClass = "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs";
                                }

                                return (
                                    <button
                                        key={qId}
                                        type="button"
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-full aspect-square rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${bgClass} ${
                                            isCurrent ? "ring-2 ring-indigo-600 ring-offset-2 scale-105" : ""
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Submission Trigger */}
                        <div className="pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowSubmitModal(true)}
                                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                                <Send className="w-4 h-4" />
                                Submit Examination
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Submit Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                Confirm Test Submission
                            </h3>
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                            Are you ready to submit your test? Once submitted, your answers will be evaluated and your scorecard generated.
                        </p>

                        {/* Summary Grid */}
                        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-center mb-6">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                    Answered
                                </span>
                                <strong className="text-lg text-emerald-600">
                                    {answeredCount}
                                </strong>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                    Unanswered
                                </span>
                                <strong className="text-lg text-red-500">
                                    {unansweredCount}
                                </strong>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                    Marked
                                </span>
                                <strong className="text-lg text-purple-600">
                                    {markedCount}
                                </strong>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowSubmitModal(false)}
                                className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                            >
                                Return to Test
                            </button>
                            <button
                                type="button"
                                onClick={executeSubmission}
                                disabled={isSubmitting}
                                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting ? "Submitting..." : "Yes, Submit Now"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
