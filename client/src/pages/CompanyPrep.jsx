import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCompanyReadiness } from "../api/api";
import {
    Building2,
    Target,
    Award,
    CheckCircle2,
    ArrowRight,
    Play,
    BookOpen,
    Edit3,
    Sparkles,
    Check,
    X,
} from "lucide-react";

export default function CompanyPrep() {
    const { user, updateUserProfile } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEditingGoals, setIsEditingGoals] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(user?.placementGoal || "Product-Based Companies");
    const [selectedTargets, setSelectedTargets] = useState(user?.targetCompanies || ["TCS", "Amazon", "Infosys"]);
    const [updating, setUpdating] = useState(false);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getCompanyReadiness();
            setCompanies(data.companies || []);
            if (data.targetCompanies) setSelectedTargets(data.targetCompanies);
            if (data.placementGoal) setSelectedGoal(data.placementGoal);
        } catch (err) {
            setError(err.message || "Failed to load company readiness");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompanies();
    }, []);

    const toggleCompanyTarget = async (companyName) => {
        let updated;
        if (selectedTargets.includes(companyName)) {
            updated = selectedTargets.filter((c) => c !== companyName);
        } else {
            updated = [...selectedTargets, companyName];
        }

        setSelectedTargets(updated);
        try {
            await updateUserProfile({ targetCompanies: updated });
            loadCompanies();
        } catch (err) {
            alert("Failed to update target companies: " + err.message);
        }
    };

    const handleSaveGoals = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            await updateUserProfile({
                placementGoal: selectedGoal,
                targetCompanies: selectedTargets,
            });
            setIsEditingGoals(false);
            loadCompanies();
        } catch (err) {
            alert("Failed to update goals: " + err.message);
        } finally {
            setUpdating(false);
        }
    };

    const allRecruiters = [
        "TCS",
        "Amazon",
        "Infosys",
        "Google",
        "Wipro",
        "Accenture",
        "Microsoft",
        "Cognizant",
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header with Goals banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-6 h-6 text-blue-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            Placement Readiness Engine
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Company-Specific Preparation Hub
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 max-w-2xl">
                        Exam patterns, syllabus breakdown, and dynamic readiness percentages calculated from your actual performance in corresponding test categories.
                    </p>

                    {/* Current Goals info */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="text-xs font-semibold px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                            Goal: {user?.placementGoal || selectedGoal}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                            Targeting:{" "}
                            <strong className="text-slate-800">
                                {selectedTargets.join(", ") || "None selected"}
                            </strong>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsEditingGoals(true)}
                    className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                    <Edit3 className="w-4 h-4" />
                    Edit Placement Goals
                </button>
            </div>

            {/* Companies Grid */}
            {loading ? (
                <div className="py-16 text-center">
                    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-3 text-sm text-slate-500">Calculating your company readiness scores...</p>
                </div>
            ) : error ? (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {companies.map((company) => {
                        const isTarget = selectedTargets.includes(company.name);
                        const readiness = company.readinessPercentage;

                        let statusColor = "bg-red-50 text-red-700 border-red-200";
                        let progressColor = "bg-red-500";
                        if (company.status === "Ready") {
                            statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                            progressColor = "bg-emerald-500";
                        } else if (company.status === "In Progress") {
                            statusColor = "bg-amber-50 text-amber-700 border-amber-200";
                            progressColor = "bg-amber-500";
                        }

                        return (
                            <div
                                key={company.name}
                                className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
                                    isTarget
                                        ? "border-blue-300 shadow-md ring-1 ring-blue-200"
                                        : "border-slate-200/80 shadow-xs hover:border-slate-300"
                                }`}
                            >
                                <div>
                                    {/* Company Header */}
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white font-black text-sm flex items-center justify-center shadow-md">
                                                {company.logo}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                                                    {company.name}
                                                </h2>
                                                <p className="text-xs text-slate-400 font-medium">
                                                    {company.badge}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleCompanyTarget(company.name)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                                                isTarget
                                                    ? "bg-blue-600 text-white shadow-xs"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                        >
                                            {isTarget ? "✓ Target" : "+ Add Target"}
                                        </button>
                                    </div>

                                    {/* Readiness Meter */}
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Preparation Readiness
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-xs font-bold px-2 py-0.5 rounded border ${statusColor}`}
                                                >
                                                    {company.status}
                                                </span>
                                                <span className="text-sm font-extrabold text-slate-900">
                                                    {readiness}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-700 ${progressColor}`}
                                                style={{ width: `${readiness}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Exam Pattern & Rounds */}
                                    <div className="space-y-3 text-xs text-slate-600">
                                        <div>
                                            <strong className="text-slate-800 block mb-1">
                                                Assessment Pattern:
                                            </strong>
                                            <p className="leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                {company.examPattern}
                                            </p>
                                        </div>

                                        <div>
                                            <strong className="text-slate-800 block mb-1">
                                                Hiring Rounds:
                                            </strong>
                                            <div className="flex flex-wrap gap-1.5">
                                                {company.rounds.map((round, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                                                    >
                                                        {idx + 1}. {round}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <strong className="text-slate-800 block mb-1">
                                                High-Weightage Topics:
                                            </strong>
                                            <div className="flex flex-wrap gap-1">
                                                {company.keyTopics.map((topic) => (
                                                    <span
                                                        key={topic}
                                                        className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[11px]"
                                                    >
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
                                    <Link
                                        to={`/practice?company=${encodeURIComponent(company.name)}`}
                                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors text-center"
                                    >
                                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                                        Practice Questions
                                    </Link>
                                    <Link
                                        to={`/mock-tests`}
                                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-colors text-center shadow-xs"
                                    >
                                        <Play className="w-3 h-3 fill-white" />
                                        Take Mock Test
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Edit Goals Modal */}
            {isEditingGoals && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                Update Placement Goals
                            </h3>
                            <button
                                onClick={() => setIsEditingGoals(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveGoals} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Target Career Domain
                                </label>
                                <select
                                    value={selectedGoal}
                                    onChange={(e) => setSelectedGoal(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                >
                                    <option value="Product-Based Companies">Product-Based Companies (FAANG / Tier-1)</option>
                                    <option value="Mass Recruiters / IT Services">Mass Recruiters (TCS, Infosys, Wipro)</option>
                                    <option value="FinTech & Banking">FinTech & Quantitative</option>
                                    <option value="High Growth Startups">High Growth Startups</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                                    Select Target Recruiters:
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {allRecruiters.map((recruiter) => {
                                        const isChecked = selectedTargets.includes(recruiter);
                                        return (
                                            <label
                                                key={recruiter}
                                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                                                    isChecked
                                                        ? "border-blue-600 bg-blue-50/80 text-blue-900 font-bold"
                                                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => {
                                                        if (isChecked) {
                                                            setSelectedTargets(selectedTargets.filter((c) => c !== recruiter));
                                                        } else {
                                                            setSelectedTargets([...selectedTargets, recruiter]);
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                                                />
                                                <span>{recruiter}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingGoals(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                                >
                                    {updating ? "Saving..." : "Save Preferences"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
