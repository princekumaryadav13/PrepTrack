import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    BookOpen,
    Clock,
    Building2,
    BarChart3,
    Shield,
    LogOut,
    Menu,
    X,
    Sparkles,
    User,
} from "lucide-react";

export default function Navbar() {
    const { user, isAdmin, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinks = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Practice", path: "/practice", icon: BookOpen },
        { name: "Mock Tests", path: "/mock-tests", icon: Clock },
        { name: "Company Prep", path: "/companies", icon: Building2 },
        { name: "Analytics", path: "/analytics", icon: BarChart3 },
    ];

    const isActive = (path) => {
        if (path === "/dashboard" && location.pathname === "/dashboard") return true;
        if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                    PrepTrack
                                </span>
                                <span className="hidden sm:inline-block ml-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                    Placement Hub
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.path);
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                            active
                                                ? "bg-blue-50 text-blue-700 shadow-xs"
                                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right side: Admin Button & User Controls */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                                    location.pathname.startsWith("/admin")
                                        ? "bg-purple-600 text-white shadow-sm"
                                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                }`}
                            >
                                <Shield className="w-3.5 h-3.5" />
                                Admin Portal
                            </Link>
                        )}

                        <div className="h-6 w-px bg-slate-200 mx-1" />

                        {/* User Profile */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs">
                                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-xs font-semibold text-slate-800 leading-none">
                                    {user?.name || "Student"}
                                </p>
                                <span
                                    className={`inline-block text-[10px] font-medium uppercase px-1.5 py-0.2 rounded mt-0.5 ${
                                        isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                    }`}
                                >
                                    {user?.role || "Student"}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sign out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile menu trigger */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium ${
                                    active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                <Icon className="w-5 h-5 text-slate-500" />
                                {link.name}
                            </Link>
                        );
                    })}

                    {isAdmin && (
                        <Link
                            to="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-purple-700 bg-purple-50"
                        >
                            <Shield className="w-5 h-5 text-purple-600" />
                            Admin Portal
                        </Link>
                    )}

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between px-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                                <p className="text-xs text-slate-500">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-xs text-red-600 font-medium px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
