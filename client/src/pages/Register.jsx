import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, ArrowRight, Lock, Mail, User, Shield, AlertCircle, CheckCircle } from "lucide-react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [placementGoal, setPlacementGoal] = useState("Product-Based Companies");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { register, login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await register({
                name,
                email,
                password,
                role,
                placementGoal,
                targetCompanies: ["TCS", "Amazon", "Infosys"],
            });

            // Automatically log in upon successful registration
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Registration failed");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-4">
                        <Sparkles className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        PrepTrack
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        Create your placement preparation account
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Get Started</h2>
                    <p className="text-slate-500 text-sm mb-6">
                        Practice aptitude, verbal, DSA, and CS fundamentals.
                    </p>

                    {error && (
                        <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Alex Johnson"
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="alex@college.edu"
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Password (min 6 characters)
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Account Role
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                                >
                                    <option value="student">Student (Candidate)</option>
                                    <option value="admin">Administrator (Faculty/Admin)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Placement Goal
                                </label>
                                <select
                                    value={placementGoal}
                                    onChange={(e) => setPlacementGoal(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                                >
                                    <option value="Product-Based Companies">Product Companies (Tier-1)</option>
                                    <option value="Mass Recruiters / IT Services">Mass Recruiters (TCS, Infy)</option>
                                    <option value="FinTech & Banking">FinTech & Quantitative</option>
                                    <option value="High Growth Startups">High Growth Startups</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/25 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Creating Account..." : "Create Account & Start"}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-500">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}