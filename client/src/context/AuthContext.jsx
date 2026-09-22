import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, registerUser, logoutUser, updateProfile } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                try {
                    const data = await getCurrentUser();
                    setUser(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                } catch (err) {
                    console.error("Auth session expired:", err.message);
                    logoutUser();
                    setUser(null);
                    setToken(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const register = async (formData) => {
        return await registerUser(formData);
    };

    const logout = () => {
        logoutUser();
        setToken(null);
        setUser(null);
    };

    const updateUserProfile = async (profileData) => {
        const data = await updateProfile(profileData);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data;
    };

    const value = {
        user,
        token,
        isAuthenticated: Boolean(token),
        isAdmin: user?.role === "admin",
        loading,
        login,
        register,
        logout,
        updateUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
