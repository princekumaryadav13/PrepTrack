import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Failed to log in");
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = (demoEmail, demoPassword) => {
        setEmail(demoEmail);
        setPassword(demoPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-4">
                        <Sparkles className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        PrepTrack
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        Placement Preparation Platform
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome back</h2>
                    <p className="text-slate-500 text-sm mb-6">
                        Log in to practice topic-wise questions and timed mock tests.
                    </p>

                    {error && (
                        <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                    placeholder="student@preptrack.com"
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/25 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Signing in..." : "Sign in to PrepTrack"}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Quick Demo Credentials */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <p className="text-xs text-slate-400 font-medium text-center mb-2.5">
                            Quick Demo Fill:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("student@preptrack.com", "student123")}
                                className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 text-center transition-colors"
                            >
                                🎓 Student Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("admin@preptrack.com", "admin123")}
                                className="py-2 px-3 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-xs font-medium text-purple-700 text-center transition-colors"
                            >
                                🛡️ Admin Demo
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-slate-500">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}