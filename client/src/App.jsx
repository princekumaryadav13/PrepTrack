import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import MockTests from "./pages/MockTests";
import MockTestRunner from "./pages/MockTestRunner";
import MockTestResult from "./pages/MockTestResult";
import CompanyPrep from "./pages/CompanyPrep";
import Analytics from "./pages/Analytics";
import AdminPortal from "./pages/AdminPortal";

// Protected Layout with Navigation
function ProtectedLayout({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
            <Navbar />
            <main className="flex-1 pb-16">{children}</main>
        </div>
    );
}

// Protected Admin-only Route
function AdminRoute({ children }) {
    const { isAdmin, loading } = useAuth();

    if (loading) return null;

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

// Public Route (redirects to dashboard if already logged in)
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null;

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            {/* Protected Student / General Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedLayout>
                        <Dashboard />
                    </ProtectedLayout>
                }
            />
            <Route
                path="/practice"
                element={
                    <ProtectedLayout>
                        <Practice />
                    </ProtectedLayout>
                }
            />
            <Route
                path="/mock-tests"
                element={
                    <ProtectedLayout>
                        <MockTests />
                    </ProtectedLayout>
                }
            />
            <Route
                path="/mock-tests/:id/take"
                element={
                    <ProtectedLayout>
                        <MockTestRunner />
                    </ProtectedLayout>
                }
            />
            <Route
                path="/mock-tests/result/:attemptId"
                element={
                    <ProtectedLayout>
                        <MockTestResult />
                    </ProtectedLayout>
                }
            />
            <Route
                path="/companies"
                element={
                    <ProtectedLayout>
                        <CompanyPrep />
                    </ProtectedLayout>
                }
            />
            <Route
                path="/analytics"
                element={
                    <ProtectedLayout>
                        <Analytics />
                    </ProtectedLayout>
                }
            />

            {/* Protected Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedLayout>
                        <AdminRoute>
                            <AdminPortal />
                        </AdminRoute>
                    </ProtectedLayout>
                }
            />

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}