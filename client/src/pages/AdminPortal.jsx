import { useEffect, useState } from "react";
import {
    getAdminQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getMockTests,
    createMockTest,
    updateMockTest,
    deleteMockTest,
} from "../api/api";
import {
    Shield,
    Plus,
    Edit2,
    Trash2,
    Search,
    BookOpen,
    Clock,
    CheckCircle2,
    X,
    AlertCircle,
} from "lucide-react";

export default function AdminPortal() {
    const [activeTab, setActiveTab] = useState("questions"); // "questions" | "tests"

    // Question State
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [questionSearch, setQuestionSearch] = useState("");
    const [questionCatFilter, setQuestionCatFilter] = useState("All");

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [questionForm, setQuestionForm] = useState({
        title: "",
        description: "",
        category: "DSA",
        topic: "",
        difficulty: "Medium",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
        companyTags: "",
        tags: "",
    });

    // Mock Test State
    const [tests, setTests] = useState([]);
    const [loadingTests, setLoadingTests] = useState(true);

    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [testForm, setTestForm] = useState({
        title: "",
        description: "",
        category: "Full-Length Placement Mock",
        companyTag: "All Companies",
        durationMinutes: 30,
        totalMarks: 50,
        passingMarks: 25,
        difficulty: "Medium",
        selectedQuestions: [], // array of question IDs
    });

    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState("");

    // Load Questions
    const loadQuestions = async () => {
        try {
            setLoadingQuestions(true);
            const data = await getAdminQuestions({
                category: questionCatFilter,
                search: questionSearch,
            });
            setQuestions(data.questions || []);
        } catch (err) {
            console.error("Failed to load questions:", err.message);
        } finally {
            setLoadingQuestions(false);
        }
    };

    // Load Mock Tests
    const loadTests = async () => {
        try {
            setLoadingTests(true);
            const data = await getMockTests();
            setTests(data.mockTests || []);
        } catch (err) {
            console.error("Failed to load tests:", err.message);
        } finally {
            setLoadingTests(false);
        }
    };

    useEffect(() => {
        loadQuestions();
    }, [questionCatFilter]);

    useEffect(() => {
        loadTests();
    }, []);

    // Open Modal for New Question
    const handleOpenNewQuestion = () => {
        setEditingQuestion(null);
        setQuestionForm({
            title: "",
            description: "",
            category: "DSA",
            topic: "",
            difficulty: "Medium",
            options: ["", "", "", ""],
            correctAnswer: "",
            explanation: "",
            companyTags: "",
            tags: "",
        });
        setIsQuestionModalOpen(true);
    };

    // Open Modal for Edit Question
    const handleOpenEditQuestion = (q) => {
        setEditingQuestion(q);
        setQuestionForm({
            title: q.title,
            description: q.description,
            category: q.category,
            topic: q.topic,
            difficulty: q.difficulty,
            options: q.options?.length === 4 ? q.options : ["", "", "", ""],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "",
            companyTags: q.companyTags ? q.companyTags.join(", ") : "",
            tags: q.tags ? q.tags.join(", ") : "",
        });
        setIsQuestionModalOpen(true);
    };

    // Submit Question Form
    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const formatted = {
                title: questionForm.title,
                description: questionForm.description,
                category: questionForm.category,
                topic: questionForm.topic,
                difficulty: questionForm.difficulty,
                options: questionForm.options.map((o) => o.trim()).filter(Boolean),
                correctAnswer: questionForm.correctAnswer.trim(),
                explanation: questionForm.explanation,
                companyTags: questionForm.companyTags
                    ? questionForm.companyTags.split(",").map((s) => s.trim()).filter(Boolean)
                    : [],
                tags: questionForm.tags
                    ? questionForm.tags.split(",").map((s) => s.trim()).filter(Boolean)
                    : [],
            };

            if (editingQuestion) {
                await updateQuestion(editingQuestion._id, formatted);
                setFeedback("Question updated successfully!");
            } else {
                await createQuestion(formatted);
                setFeedback("New question added successfully!");
            }

            setIsQuestionModalOpen(false);
            loadQuestions();
            setTimeout(() => setFeedback(""), 4000);
        } catch (err) {
            alert("Error saving question: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete Question
    const handleDeleteQuestion = async (id) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        try {
            await deleteQuestion(id);
            loadQuestions();
            setFeedback("Question deleted successfully.");
            setTimeout(() => setFeedback(""), 3000);
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    };

    // Open Modal for New Mock Test
    const handleOpenNewTest = () => {
        setEditingTest(null);
        setTestForm({
            title: "",
            description: "",
            category: "Full-Length Placement Mock",
            companyTag: "All Companies",
            durationMinutes: 30,
            totalMarks: 40,
            passingMarks: 20,
            difficulty: "Medium",
            selectedQuestions: questions.slice(0, 6).map((q) => q._id),
        });
        setIsTestModalOpen(true);
    };

    // Submit Test Form
    const handleSaveTest = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const formatted = {
                title: testForm.title,
                description: testForm.description,
                category: testForm.category,
                companyTag: testForm.companyTag,
                durationMinutes: parseInt(testForm.durationMinutes),
                totalMarks: parseInt(testForm.totalMarks),
                passingMarks: parseInt(testForm.passingMarks),
                difficulty: testForm.difficulty,
                questions: testForm.selectedQuestions.map((qId) => ({
                    question: qId,
                    marks: 5,
                })),
            };

            if (editingTest) {
                await updateMockTest(editingTest._id, formatted);
                setFeedback("Mock test updated successfully!");
            } else {
                await createMockTest(formatted);
                setFeedback("New mock test created successfully!");
            }

            setIsTestModalOpen(false);
            loadTests();
            setTimeout(() => setFeedback(""), 4000);
        } catch (err) {
            alert("Error saving test: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete Test
    const handleDeleteTest = async (id) => {
        if (!window.confirm("Are you sure you want to delete this mock test?")) return;
        try {
            await deleteMockTest(id);
            loadTests();
            setFeedback("Mock test deleted successfully.");
            setTimeout(() => setFeedback(""), 3000);
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur mb-2">
                        <Shield className="w-3.5 h-3.5 text-purple-300" />
                        Administrator Management Portal
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Content & Examination Control
                    </h1>
                    <p className="mt-1 text-purple-200 text-xs sm:text-sm">
                        Create, edit, and manage topic-wise questions and timed placement mock tests.
                    </p>
                </div>

                <div className="flex bg-white/10 p-1 rounded-xl border border-white/20 backdrop-blur self-start sm:self-auto">
                    <button
                        onClick={() => setActiveTab("questions")}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === "questions" ? "bg-white text-purple-900 shadow-md" : "text-white"
                        }`}
                    >
                        Questions ({questions.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("tests")}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === "tests" ? "bg-white text-purple-900 shadow-md" : "text-white"
                        }`}
                    >
                        Mock Tests ({tests.length})
                    </button>
                </div>
            </div>

            {/* Feedback Alert */}
            {feedback && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {feedback}
                </div>
            )}

            {/* QUESTIONS TAB */}
            {activeTab === "questions" && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleOpenNewQuestion}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Question
                            </button>

                            {/* Category Filter */}
                            <select
                                value={questionCatFilter}
                                onChange={(e) => setQuestionCatFilter(e.target.value)}
                                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >
                                <option value="All">All Categories</option>
                                <option value="DSA">DSA</option>
                                <option value="Aptitude">Aptitude</option>
                                <option value="Verbal">Verbal</option>
                                <option value="CS Fundamentals">CS Fundamentals</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={questionSearch}
                                onChange={(e) => setQuestionSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && loadQuestions()}
                                placeholder="Search questions..."
                                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>
                    </div>

                    {/* Questions Table */}
                    {loadingQuestions ? (
                        <div className="py-12 text-center text-slate-500 text-sm">
                            Loading questions...
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 text-sm">
                            No questions found in this category.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="text-[11px] uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3">Question</th>
                                        <th className="px-4 py-3">Category</th>
                                        <th className="px-4 py-3">Topic</th>
                                        <th className="px-4 py-3">Difficulty</th>
                                        <th className="px-4 py-3">Answer</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {questions.map((q) => (
                                        <tr key={q._id} className="hover:bg-slate-50/80">
                                            <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
                                                {q.title}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                                                    {q.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 font-medium">
                                                {q.topic}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                                        q.difficulty === "Easy"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : q.difficulty === "Medium"
                                                            ? "bg-amber-50 text-amber-700"
                                                            : "bg-red-50 text-red-700"
                                                    }`}
                                                >
                                                    {q.difficulty}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-emerald-700 font-semibold max-w-[150px] truncate">
                                                {q.correctAnswer}
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <button
                                                    onClick={() => handleOpenEditQuestion(q)}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50"
                                                    title="Edit question"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuestion(q._id)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    title="Delete question"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* MOCK TESTS TAB */}
            {activeTab === "tests" && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Configured Mock Tests</h2>
                            <p className="text-xs text-slate-500">Timed placement simulation papers</p>
                        </div>
                        <button
                            onClick={handleOpenNewTest}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Create Mock Test
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tests.map((t) => (
                            <div
                                key={t._id}
                                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                                            {t.category}
                                        </span>
                                        {t.companyTag && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                                {t.companyTag}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">{t.title}</h3>
                                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{t.description}</p>

                                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                                        <span>⏱ {t.durationMinutes} mins</span>
                                        <span>•</span>
                                        <span>📝 {t.questionCount} Questions</span>
                                        <span>•</span>
                                        <span>🎯 {t.passingMarks}/{t.totalMarks} Pass</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleDeleteTest(t._id)}
                                        className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded"
                                    >
                                        Delete Test
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Question Modal */}
            {isQuestionModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editingQuestion ? "Edit Question" : "Create New Placement Question"}
                            </h3>
                            <button
                                onClick={() => setIsQuestionModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Question Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={questionForm.title}
                                    onChange={(e) =>
                                        setQuestionForm({ ...questionForm, title: e.target.value })
                                    }
                                    placeholder="e.g. Time and Work: Pipe and Cistern Efficiency"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Description / Problem Statement
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={questionForm.description}
                                    onChange={(e) =>
                                        setQuestionForm({ ...questionForm, description: e.target.value })
                                    }
                                    placeholder="Full question details..."
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={questionForm.category}
                                        onChange={(e) =>
                                            setQuestionForm({ ...questionForm, category: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    >
                                        <option value="DSA">DSA</option>
                                        <option value="Aptitude">Aptitude</option>
                                        <option value="Verbal">Verbal</option>
                                        <option value="CS Fundamentals">CS Fundamentals</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Topic
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={questionForm.topic}
                                        onChange={(e) =>
                                            setQuestionForm({ ...questionForm, topic: e.target.value })
                                        }
                                        placeholder="e.g. Dynamic Programming"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Difficulty
                                    </label>
                                    <select
                                        value={questionForm.difficulty}
                                        onChange={(e) =>
                                            setQuestionForm({ ...questionForm, difficulty: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>

                            {/* 4 Options */}
                            <div className="space-y-2">
                                <label className="block font-semibold text-slate-700">
                                    Multiple Choice Options (4)
                                </label>
                                {questionForm.options.map((opt, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        required
                                        value={opt}
                                        onChange={(e) => {
                                            const updated = [...questionForm.options];
                                            updated[i] = e.target.value;
                                            setQuestionForm({ ...questionForm, options: updated });
                                        }}
                                        placeholder={`Option ${i + 1}`}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    />
                                ))}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Correct Answer (Must match one option exactly)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={questionForm.correctAnswer}
                                    onChange={(e) =>
                                        setQuestionForm({ ...questionForm, correctAnswer: e.target.value })
                                    }
                                    placeholder="Enter exact correct option text"
                                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/50 text-xs text-emerald-900 font-bold focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Detailed Explanation
                                </label>
                                <textarea
                                    rows={2}
                                    value={questionForm.explanation}
                                    onChange={(e) =>
                                        setQuestionForm({ ...questionForm, explanation: e.target.value })
                                    }
                                    placeholder="Explanation of the solution..."
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Company Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={questionForm.companyTags}
                                        onChange={(e) =>
                                            setQuestionForm({ ...questionForm, companyTags: e.target.value })
                                        }
                                        placeholder="e.g. TCS, Amazon, Infosys"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Keywords / Tags
                                    </label>
                                    <input
                                        type="text"
                                        value={questionForm.tags}
                                        onChange={(e) =>
                                            setQuestionForm({ ...questionForm, tags: e.target.value })
                                        }
                                        placeholder="e.g. Arrays, Recursion"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsQuestionModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-500/20 cursor-pointer"
                                >
                                    {submitting ? "Saving..." : "Save Question"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Mock Test Modal */}
            {isTestModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editingTest ? "Edit Mock Test" : "Create New Placement Mock Test"}
                            </h3>
                            <button
                                onClick={() => setIsTestModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTest} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Mock Test Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={testForm.title}
                                    onChange={(e) =>
                                        setTestForm({ ...testForm, title: e.target.value })
                                    }
                                    placeholder="e.g. TCS NQT Full Placement Mock Test - 2025"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={testForm.description}
                                    onChange={(e) =>
                                        setTestForm({ ...testForm, description: e.target.value })
                                    }
                                    placeholder="Test instructions, format, and syllabus..."
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={testForm.category}
                                        onChange={(e) =>
                                            setTestForm({ ...testForm, category: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    >
                                        <option value="Full-Length Placement Mock">Full-Length Mock</option>
                                        <option value="Company Specific">Company Specific</option>
                                        <option value="Aptitude Special">Aptitude Special</option>
                                        <option value="Verbal & Reasoning">Verbal & Reasoning</option>
                                        <option value="CS Core Fundamentals">CS Core</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Company Tag
                                    </label>
                                    <input
                                        type="text"
                                        value={testForm.companyTag}
                                        onChange={(e) =>
                                            setTestForm({ ...testForm, companyTag: e.target.value })
                                        }
                                        placeholder="e.g. TCS, Amazon, All"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Duration (mins)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min={5}
                                        max={180}
                                        value={testForm.durationMinutes}
                                        onChange={(e) =>
                                            setTestForm({ ...testForm, durationMinutes: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Total Marks
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={testForm.totalMarks}
                                        onChange={(e) =>
                                            setTestForm({ ...testForm, totalMarks: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Pass Marks
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={testForm.passingMarks}
                                        onChange={(e) =>
                                            setTestForm({ ...testForm, passingMarks: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                                    />
                                </div>
                            </div>

                            {/* Select Questions */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-2">
                                    Include Questions ({testForm.selectedQuestions.length} selected):
                                </label>
                                <div className="max-h-48 overflow-y-auto space-y-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                    {questions.map((q) => {
                                        const isSelected = testForm.selectedQuestions.includes(q._id);
                                        return (
                                            <label
                                                key={q._id}
                                                className={`flex items-center gap-2 p-2 rounded-xl text-xs cursor-pointer ${
                                                    isSelected ? "bg-purple-50 text-purple-900 font-bold" : "text-slate-700"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => {
                                                        if (isSelected) {
                                                            setTestForm({
                                                                ...testForm,
                                                                selectedQuestions: testForm.selectedQuestions.filter(
                                                                    (id) => id !== q._id
                                                                ),
                                                            });
                                                        } else {
                                                            setTestForm({
                                                                ...testForm,
                                                                selectedQuestions: [
                                                                    ...testForm.selectedQuestions,
                                                                    q._id,
                                                                ],
                                                            });
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-purple-600 rounded"
                                                />
                                                <span className="truncate">
                                                    [{q.category}] {q.title}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsTestModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || testForm.selectedQuestions.length === 0}
                                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-500/20 cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : "Save Mock Test"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
