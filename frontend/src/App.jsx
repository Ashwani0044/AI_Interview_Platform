import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Resume from "./pages/Resume";
import Interview from "./pages/Interview";
import History from "./pages/History";
import Profile from "./pages/Profile";
import InterviewSession from "./pages/InterviewSession";

function ProtectedRoute({ children }) {

    const { isAuthenticated } = useAuth();

    return isAuthenticated
        ? children
        : <Navigate to="/login" replace />;

}

function PublicRoute({ children }) {

    const { isAuthenticated } = useAuth();

    return !isAuthenticated
        ? children
        : <Navigate to="/dashboard" replace />;

}

export default function App() {

    const { isAuthenticated } = useAuth();

    return (

        <Routes>

            <Route
                path="/"
                element={
                    <Navigate
                        to={
                            isAuthenticated
                                ? "/dashboard"
                                : "/login"
                        }
                        replace
                    />
                }
            />

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

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/resume"
                element={
                    <ProtectedRoute>
                        <Resume />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/interview"
                element={
                    <ProtectedRoute>
                        <Interview />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/history"
                element={
                    <ProtectedRoute>
                        <History />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/session"
                element={
                    <ProtectedRoute>
                        <InterviewSession />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>

    );

}