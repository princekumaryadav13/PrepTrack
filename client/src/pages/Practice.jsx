import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getQuestions } from "../api/api";
import QuestionPractice from "./QuestionPractice";
import {
    Search,
    BookOpen,
    Filter,
    Building2,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    SlidersHorizontal,
} from "lucide-react";

export default function Practice() {
    const [searchParams, setSearchParams] = useSearchParams();

    const initialCategory = searchParams.get("category") || "All";
    const initialTopic = searchParams.get("topic") || "";
    const initialDifficulty = searchParams.get("difficulty") || "All";
    const initialCompany = searchParams.get("company") || "All";

    const [category, setCategory] = useState(initialCategory);
    const [topic, setTopic] = useState(initialTopic);
    const [difficulty, setDifficulty] = useState(initialDifficulty);
    const [company, setCompany] = useState(initialCompany);
    const [search, setSearch] = useState("");

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalQuestions: 0 });

    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const categories = ["All", "DSA", "Aptitude", "Verbal", "CS Fundamentals"];
    const difficulties = ["All", "Easy", "Medium", "Hard"];
    const companies = ["All", "TCS", "Amazon", "Infosys", "Google", "Wipro", "Accenture", "Microsoft"];

    const loadQuestions = async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            const params = {
                page,
                limit: 12,
                ...(category !== "All" && { category }),
                ...(topic && { topic }),
                ...(difficulty !== "All" && { difficulty }),
                ...(company !== "All" && { company }),
                ...(search && { search }),
            };

            const data = await getQuestions(params);
            setQuestions(data.questions);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message || "Failed to load questions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuestions(1);
    }, [category, difficulty, company, topic]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadQuestions(1);
    };

    const handleClearFilters = () => {
        setCategory("All");
        setTopic("");
        setDifficulty("All");
        setCompany("All");
        setSearch("");
        setSearchParams({});
    };

    // If an individual question is active
    if (selectedQuestionId) {
        return (
            <QuestionPractice
                questionId={selectedQuestionId}
                onBack={() => setSelectedQuestionId(null)}
                onNext={() => {
                    const nextIndex = currentQuestionIndex + 1;
                    if (nextIndex < questions.length) {
                        setCurrentQuestionIndex(nextIndex);
                        setSelectedQuestionId(questions[nextIndex]._id);
                    } else {
                        setSelectedQuestionId(null);
                        loadQuestions(pagination.currentPage);
                    }
                }}
            />
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        Placement Question Bank
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Topic-wise questions across Aptitude, Verbal, DSA, and Core CS Fundamentals.
                    </p>
                </div>

                {topic && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                        <span>Practicing topic: <strong>{topic}</strong></span>
                        <button
                            onClick={() => setTopic("")}
                            className="text-blue-500 hover:text-blue-800 ml-1"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {/* Filter and Search Panel */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                {/* Category Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
                        Category:
                    </span>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                                category === cat
                                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Second Row: Company, Difficulty & Search */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                    {/* Search Input */}
                    <form onSubmit={handleSearchSubmit} className="relative sm:col-span-2">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search questions by keyword or topic..."
                            className="w-full pl-9 pr-20 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </form>

                    {/* Difficulty Dropdown */}
                    <div>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        >
                            <option value="All">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    {/* Company Filter Dropdown */}
                    <div>
                        <select
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        >
                            <option value="All">All Target Recruiters</option>
                            {companies.filter((c) => c !== "All").map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {(category !== "All" || difficulty !== "All" || company !== "All" || topic || search) && (
                    <div className="flex items-center justify-between text-xs pt-2 text-slate-500 border-t border-slate-100">
                        <span>Showing {pagination.totalQuestions} questions for selected criteria</span>
                        <button
                            onClick={handleClearFilters}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Questions Grid */}
            {loading ? (
                <div className="py-16 text-center">
                    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-3 text-sm text-slate-500">Loading questions...</p>
                </div>
            ) : error ? (
                <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            ) : questions.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No questions found</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Try changing your filters, search term, or select another category.
                    </p>
                    <button
                        onClick={handleClearFilters}
                        className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {questions.map((q, idx) => (
                        <div
                            key={q._id}
                            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                                        {q.category}
                                    </span>
                                    <span
                                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                            q.difficulty === "Easy"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : q.difficulty === "Medium"
                                                ? "bg-amber-50 text-amber-700"
                                                : "bg-red-50 text-red-700"
                                        }`}
                                    >
                                        {q.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                                    {q.title}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    Topic: <span className="text-slate-700">{q.topic}</span>
                                </p>
                                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                                    {q.description}
                                </p>

                                {q.companyTags && q.companyTags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {q.companyTags.slice(0, 3).map((comp) => (
                                            <span
                                                key={comp}
                                                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                                            >
                                                {comp}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    setCurrentQuestionIndex(idx);
                                    setSelectedQuestionId(q._id);
                                }}
                                className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
                            >
                                Practice Question
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}