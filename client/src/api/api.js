// const API_URL = "http://localhost:5000/api";

 const API_URL = import.meta.env.VITE_API_URL;
 
const getToken = () => {
    return localStorage.getItem("token");
};

const authHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// ==================== AUTH ====================
export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
};

export const registerUser = async (formData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
};

export const getCurrentUser = async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user");
    }

    return data;
};

export const updateProfile = async (profileData) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(profileData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
    }

    return data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// ==================== QUESTIONS ====================
export const getQuestions = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/questions?${query}`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch questions");
    }

    return data;
};

export const getQuestionById = async (id) => {
    const response = await fetch(`${API_URL}/questions/${id}`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch question");
    }

    return data;
};

export const getAdminQuestions = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/questions/admin/all?${query}`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch admin questions");
    }

    return data;
};

export const createQuestion = async (questionData) => {
    const response = await fetch(`${API_URL}/questions`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(questionData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to create question");
    }

    return data;
};

export const updateQuestion = async (id, questionData) => {
    const response = await fetch(`${API_URL}/questions/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(questionData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to update question");
    }

    return data;
};

export const deleteQuestion = async (id) => {
    const response = await fetch(`${API_URL}/questions/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to delete question");
    }

    return data;
};

// ==================== ATTEMPTS ====================
export const submitAnswer = async (questionId, selectedAnswer, timeTaken) => {
    const response = await fetch(`${API_URL}/attempts`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ questionId, selectedAnswer, timeTaken }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to submit answer");
    }

    return data;
};

// ==================== PROGRESS ====================
export const getProgress = async () => {
    const response = await fetch(`${API_URL}/progress`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch progress");
    }

    return data;
};

// ==================== MOCK TESTS ====================
export const getMockTests = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/tests?${query}`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch mock tests");
    }

    return data;
};

export const getMockTestById = async (id) => {
    const response = await fetch(`${API_URL}/tests/${id}`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch mock test");
    }

    return data;
};

export const getAdminMockTestById = async (id) => {
    const response = await fetch(`${API_URL}/tests/${id}/admin`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch admin test details");
    }

    return data;
};

export const createMockTest = async (testData) => {
    const response = await fetch(`${API_URL}/tests`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(testData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to create mock test");
    }

    return data;
};

export const updateMockTest = async (id, testData) => {
    const response = await fetch(`${API_URL}/tests/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(testData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to update mock test");
    }

    return data;
};

export const deleteMockTest = async (id) => {
    const response = await fetch(`${API_URL}/tests/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to delete mock test");
    }

    return data;
};

export const submitMockTest = async (id, answers, timeTakenSeconds) => {
    const response = await fetch(`${API_URL}/tests/${id}/submit`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ answers, timeTakenSeconds }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to submit mock test");
    }

    return data;
};

export const getMyTestAttempts = async () => {
    const response = await fetch(`${API_URL}/tests/attempts/my`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch past test attempts");
    }

    return data;
};

export const getTestAttemptDetails = async (attemptId) => {
    const response = await fetch(`${API_URL}/tests/attempts/${attemptId}`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch test scorecard");
    }

    return data;
};

// ==================== RECOMMENDATIONS & COMPANIES ====================
export const getRecommendations = async () => {
    const response = await fetch(`${API_URL}/recommendations`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recommendations");
    }

    return data;
};

export const getCompanyReadiness = async () => {
    const response = await fetch(`${API_URL}/recommendations/companies`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch company readiness");
    }

    return data;
};